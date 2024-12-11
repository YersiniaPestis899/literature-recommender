# Literature Recommender

パーソナライズされた文学作品レコメンデーションシステム。AWS Bedrock Claude 3.5を活用して、ユーザーの好みに合わせた本の推薦を提供します。

## 技術スタック

- Next.js
- TypeScript
- Tailwind CSS
- AWS Bedrock (Claude 3.5)

## 機能

- パーソナライズされた本の推薦
- インタラクティブな質問フォーム
- リアルタイムAI分析
- レスポンシブデザイン

## セットアップ手順

1. リポジトリのクローン
```bash
git clone [repository-url]
cd literature-recommender
```

2. 依存関係のインストール
```bash
npm install
```

3. 環境変数の設定
```bash
cp .env.example .env.local
# .env.localに必要な環境変数を設定
```

4. 開発サーバーの起動
```bash
npm run dev
```

## 環境変数

以下の環境変数が必要です：

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_REGION

## デプロイ

VercelへのデプロイはGitHubリポジトリと連携して自動的に行われます。
環境変数の設定を忘れずに行ってください。

## ライセンス

MIT

## 作者

[Your Name]