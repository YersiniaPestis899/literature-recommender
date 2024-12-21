import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// 型定義
export interface BookRecommendation {
  title: string;
  author: string;
  reason: string;
  genre: string;
  matchType: 'precise' | 'discovery';
  amazonLink?: string;
}

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

interface RecommendationResponse {
  recommendations: BookRecommendation[];
}

// BedrockClientの作成ユーティリティ
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

// APIリクエストの作成
const createApiRequest = (prompt: string) => {
  return new InvokeModelCommand({
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
};

// メインの推薦機能
export async function getRecommendations(userResponses: Record<string, string>): Promise<{ recommendations: BookRecommendation[] }> {
  try {
    const client = createBedrockClient();
    
    const prompt = `
文学作品の専門家として、ユーザーの好みに合わせた本を6作品推薦してください。
以下の基準で推薦を行ってください：

【推薦基準】
1. 最初の3-4作品：ユーザーの好みに最も合致する作品
   - 読者の興味・関心に直接応える
   - ジャンルや雰囲気が明確にマッチ

2. 残りの2-3作品：マイナーだが価値のある発見となる作品
   - 主要な書店では見つけにくい隠れた名作
   - ユーザーの興味を新しい方向に広げられる可能性のある作品
   - メインストリームではないが、高い文学性や独自の魅力を持つ作品

【ユーザーの回答】
${Object.entries(userResponses)
  .map(([question, answer]) => `${question}: ${answer}`)
  .join('\n')}

以下の形式でJSONレスポンスを提供してください：
{
  "recommendations": [
    {
      "title": "作品名",
      "author": "著者名",
      "reason": "推薦理由（作品の特徴と読者への価値を具体的に）",
      "genre": "ジャンル",
      "matchType": "precise（ぴったりマッチ） | discovery（新しい発見）"
    }
  ]
}

各作品について、なぜその本が読者にとって価値があるのか、具体的に説明してください。`;

    const command = createApiRequest(prompt);
    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body)) as BedrockResponse;
    
    console.log('API Response Structure:', JSON.stringify(responseBody, null, 2));

    if (!responseBody.content || !Array.isArray(responseBody.content)) {
      console.error('Invalid response structure:', responseBody);
      throw new Error('APIレスポンスの形式が不正です');
    }

    const textContent = responseBody.content.find((item: { type: string; text: string }) => item.type === 'text')?.text;
    if (!textContent) {
      throw new Error('テキストコンテンツが見つかりません');
    }

    try {
      const parsedResponse = JSON.parse(textContent) as RecommendationResponse;
      
      if (!parsedResponse?.recommendations?.length) {
        throw new Error('レコメンデーションデータの形式が不正です');
      }

      // Amazon検索リンクの生成
      const enhancedRecommendations = parsedResponse.recommendations.map((book) => ({
        ...book,
        amazonLink: `https://www.amazon.co.jp/s?k=${encodeURIComponent(`${book.title} ${book.author}`)}`
      }));

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