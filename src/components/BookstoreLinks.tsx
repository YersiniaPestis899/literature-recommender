import { ShoppingCartIcon } from '@heroicons/react/24/outline';

interface BookstoreLinksProps {
  links: {
    amazon: string;
    rakuten: string;
    kinokuniya: string;
  };
}

export const BookstoreLinks: React.FC<BookstoreLinksProps> = ({ links }) => {
  return (
    <div className="mt-4 space-y-2">
      <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
        <ShoppingCartIcon className="h-4 w-4 mr-1" />
        購入はこちら
      </p>
      <div className="flex flex-wrap gap-2">
        <a
          href={links.amazon}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full hover:bg-yellow-200 transition-colors"
        >
          Amazon
        </a>
        <a
          href={links.rakuten}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full hover:bg-red-200 transition-colors"
        >
          楽天ブックス
        </a>
        <a
          href={links.kinokuniya}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-200 transition-colors"
        >
          紀伊國屋書店
        </a>
      </div>
    </div>
  );
};