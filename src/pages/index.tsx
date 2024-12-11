import { useState } from 'react'
import Head from 'next/head'
import { BookOpenIcon } from '@heroicons/react/24/outline'

const questions = [
  {
    id: 'preferred_genre',
    question: 'どのようなジャンルの本をお好みですか？',
    placeholder: '例：ミステリー、恋愛小説、SF...'
  },
  {
    id: 'reading_pace',
    question: '普段どのくらい読書に時間を使いますか？',
    placeholder: '例：毎日1時間、週末のみ...'
  },
  {
    id: 'themes',
    question: 'どのようなテーマや題材に興味がありますか？',
    placeholder: '例：自己成長、社会問題、冒険...'
  },
  {
    id: 'mood',
    question: '本を読むときにどのような感情体験を求めますか？',
    placeholder: '例：元気が出る、考えさせられる、わくわくする...'
  }
]

export default function Home() {
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pageTitle = "パーソナライズド文学レコメンダー | AIが選ぶあなたにぴったりの本"
  const pageDescription = "AIが、あなたの好みや興味に基づいて、最適な文学作品を提案します。クラシックから現代文学まで、幅広い作品からパーソナライズされたおすすめを提供します。"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responses),
      })
      if (!res.ok) {
        throw new Error('レコメンデーションの取得に失敗しました')
      }
      const data = await res.json()
      setRecommendations(data.recommendations)
    } catch (error) {
      console.error('Error:', error)
      setError('エラーが発生しました。もう一度お試しください。')
    }
    setLoading(false)
  }

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

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-6">
              <BookOpenIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-serif font-medium text-gray-900 mb-3">
              Personalized Literature
            </h1>
            <p className="text-lg text-gray-600 font-light">
              あなただけの文学的冒険をお手伝いします
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mb-12">
            {questions.map((q) => (
              <div 
                key={q.id} 
                className="bg-white backdrop-blur-sm bg-opacity-80 p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md"
              >
                <label className="block text-gray-800 font-medium mb-3">
                  {q.question}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400"
                  placeholder={q.placeholder}
                  value={responses[q.id] || ''}
                  onChange={(e) =>
                    setResponses((prev) => ({
                      ...prev,
                      [q.id]: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-4 px-6 rounded-lg font-medium shadow-lg hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  レコメンデーションを生成中...
                </div>
              ) : (
                'あなたにぴったりの本を探す'
              )}
            </button>
          </form>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 text-sm font-medium">
              {error}
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-medium text-gray-900 mb-6 text-center">
                あなたへのおすすめの文学作品
              </h2>
              <div className="grid gap-6">
                {recommendations.map((book, index) => (
                  <div
                    key={index}
                    className="bg-white backdrop-blur-sm bg-opacity-80 p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                          『{book.title}』
                        </h3>
                        <p className="text-gray-600 mb-1">著者：{book.author}</p>
                        <p className="text-gray-500 text-sm mb-3">ジャンル：{book.genre}</p>
                      </div>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full">
                        {index + 1}位
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {book.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Personalized Literature. All rights reserved.</p>
      </footer>
    </div>
  )
}