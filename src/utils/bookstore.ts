interface BookSearchParams {
  title: string;
  author: string;
}

export async function findBookstoreLinks({ title, author }: BookSearchParams) {
  // 基本的なエンコーディング
  const encodedTitle = encodeURIComponent(title);
  const encodedAuthor = encodeURIComponent(author);

  // 各書店の検索URLを生成
  const links = {
    amazon: `https://www.amazon.co.jp/s?k=${encodedTitle}+${encodedAuthor}`,
    rakuten: `https://books.rakuten.co.jp/search?sitem=${encodedTitle}+${encodedAuthor}`,
    kinokuniya: `https://www.kinokuniya.co.jp/disp/CSfDispListPage_001.jsp?qs=${encodedTitle}+${encodedAuthor}`,
  };

  return links;
}

// レスポンス型の拡張
export interface BookRecommendation {
  title: string;
  author: string;
  reason: string;
  genre: string;
  purchaseLinks?: {
    amazon: string;
    rakuten: string;
    kinokuniya: string;
  };
}