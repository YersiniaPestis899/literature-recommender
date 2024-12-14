import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { findBookstoreLinks, BookRecommendation } from './bookstore';

// レスポンス型の定義
interface BedrockResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  id: string;
  model: string;
  role: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

// Bedrockクライアント作成ユーティリティ
const createBedrockClient = () => {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION;

  if (!accessKeyId || !secretAccessKey || !region) {
    throw new Error('AWS認証情報が設定されていません');
  }

  return new BedrockRuntimeClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
};

// メインの推薦機能
export async function getRecommendations(userResponses: Record<string, string>) {
  try {
    const client = createBedrockClient();
    
    // プロンプトの構築
    const prompt = `
文学作品の専門家として、以下のユーザーの回答に基づいて、最適な文学作品を3-5作品推薦してください。

【ユーザーの回答】
${Object.entries(userResponses)
  .map(([question, answer]) => `${question}: ${answer}`)
  .join('\n')}

以下の形式でレスポンスを提供してください：

{
  "recommendations": [
    {
      "title": "作品名",
      "author": "著者名",
      "reason": "この本をおすすめする理由の簡潔な説明",
      "genre": "主要なジャンル"
    }
  ]
}

クラシックな作品から現代文学まで幅広く検討し、各作品について説得力のある推薦理由を提供してください。必ず上記のJSON形式で返してください。他の説明は不要です。`;

    // APIリクエストの構築
    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 2000,
        top_k: 250,
        stop_sequences: [],
        temperature: 0.8,
        top_p: 0.999,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              }
            ]
          }
        ]
      })
    });

    // APIリクエストの実行とレスポンス処理
    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body)) as BedrockResponse;
    
    // デバッグ用ログ
    console.log('API Response Structure:', JSON.stringify(responseBody, null, 2));

    // レスポンス構造の検証と解析
    if (!responseBody.content || !Array.isArray(responseBody.content)) {
      console.error('Invalid response structure:', responseBody);
      throw new Error('APIレスポンスの形式が不正です');
    }

    const textContent = responseBody.content.find((item: { type: string; text: string }) => item.type === 'text')?.text;
    if (!textContent) {
      throw new Error('テキストコンテンツが見つかりません');
    }

    try {
      const recommendations = JSON.parse(textContent);
      
      // レコメンデーションの構造を検証
      if (!recommendations?.recommendations?.length) {
        throw new Error('レコメンデーションデータの形式が不正です');
      }

      // 各レコメンデーションに購入リンクを追加
      const enhancedRecommendations = await Promise.all(
        recommendations.recommendations.map(async (book: BookRecommendation) => {
          const purchaseLinks = await findBookstoreLinks({
            title: book.title,
            author: book.author
          });
          return {
            ...book,
            purchaseLinks
          };
        })
      );

      return { recommendations: enhancedRecommendations };

    } catch (parseError) {
      console.error('Parse error:', parseError);
      throw new Error('レコメンデーション結果の解析に失敗しました');
    }
  } catch (error: any) {
    console.error('Error in getRecommendations:', error);
    
    if (error.$metadata?.httpStatusCode === 400) {
      throw new Error('APIリクエストの形式が不正です');
    } else if (error.$metadata?.httpStatusCode === 403) {
      throw new Error('AWS認証に失敗しました');
    }
    throw new Error('レコメンデーションの取得に失敗しました');
  }
}