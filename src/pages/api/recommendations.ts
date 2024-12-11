import type { NextApiRequest, NextApiResponse } from 'next'
import { getRecommendations } from '../../utils/bedrock'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: '許可されていないメソッドです'
    })
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      error: 'Invalid request',
      message: '質問への回答が含まれていません'
    })
  }

  try {
    // 認証情報の確認
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error('AWS認証情報が設定されていません');
    }

    const recommendations = await getRecommendations(req.body)
    
    if (!recommendations?.recommendations?.length) {
      throw new Error('レコメンデーションの形式が不正です')
    }
    
    res.status(200).json(recommendations)
  } catch (error: any) {
    console.error('Recommendation error:', error)
    
    // エラーの種類に応じたレスポンス
    if (error.message.includes('AWS認証')) {
      return res.status(500).json({
        error: 'Authentication Error',
        message: 'サーバーの設定に問題があります。管理者に連絡してください。'
      })
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message || 'レコメンデーションの取得中にエラーが発生しました'
    })
  }
}