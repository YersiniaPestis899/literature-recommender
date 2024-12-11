import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Google Search Console Verification */}
        <meta 
          name="google-site-verification" 
          content="YOUR_VERIFICATION_CODE"  // Google Search Consoleから取得したコードを設定
        />

        {/* Open Graph / SNS */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Personalized Literature" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* PWA関連 */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4F46E5" />

        {/* フォント最適化 */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" 
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}