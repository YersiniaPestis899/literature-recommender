import { useState } from 'react'
import Head from 'next/head'
import { BookOpenIcon } from '@heroicons/react/24/outline'

// ... 既存のquestions配列 ...

export default function Home() {
  // ... 既存のstate管理 ...

  const pageTitle = "パーソナライズド文学レコメンダー | AIが選ぶあなたにぴったりの本"
  const pageDescription = "AIが、あなたの好みや興味に基づいて、最適な文学作品を提案します。クラシックから現代文学まで、幅広い作品からパーソナライズされたおすすめを提供します。"

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        
        {/* Open Graph / SNS */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content="https://your-domain.vercel.app" />
        <meta property="og:image" content="https://your-domain.vercel.app/og-image.jpg" />
        
        {/* SEO関連 */}
        <meta name="keywords" content="本のおすすめ,読書,AI,レコメンデーション,文学,小説,書籍紹介" />
        <meta name="author" content="Personalized Literature Team" />
        <link rel="canonical" href="https://your-domain.vercel.app" />

        {/* 構造化データ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "パーソナライズド文学レコメンダー",
              "description": pageDescription,
              "applicationCategory": "LifestyleApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "JPY"
              }
            })
          }}
        />
      </Head>

      {/* 既存のコンポーネント内容... */}
    </div>
  )
}