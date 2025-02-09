import { type Product } from "@/lib/shop-templates";
import { Star, ShoppingCart, Package } from "lucide-react";

interface ShopCardProps {
  query: string;
  products: Product[];
  totalResults?: number;
  suggestedFilters?: string[];
}

export function ShopCard({
  query,
  products,
  totalResults,
  suggestedFilters,
}: ShopCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Results for "{query}"</h3>
        {totalResults && (
          <span className="text-sm text-gray-500">
            {totalResults} products found
          </span>
        )}
      </div>

      {suggestedFilters && suggestedFilters.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {suggestedFilters.map((filter) => (
            <button
              key={filter}
              className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border-2 border-black rounded-lg p-4 space-y-3 bg-white shadow-brutal hover:shadow-brutal-lg transition-shadow"
          >
            <div className="relative overflow-hidden rounded-md w-32 h-32 mx-auto">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-contain w-full h-full"
              />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium line-clamp-2">{product.name}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < product.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                {product.reviews && (
                  <span className="text-sm text-gray-500">
                    ({product.reviews})
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">${product.price}</span>
                {product.prime && (
                  <div className="flex items-center gap-1 text-sm text-blue-600">
                    <Package className="w-4 h-4" />
                    Prime
                  </div>
                )}
              </div>

              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  <ShoppingCart className="w-4 h-4" />
                  View on Amazon
                </button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
