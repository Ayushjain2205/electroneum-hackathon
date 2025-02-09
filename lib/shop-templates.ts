export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  imageUrl: string;
  url: string;
  prime?: boolean;
  reviews?: number;
}

export interface ShopData {
  query: string;
  products: Product[];
  totalResults?: number;
  suggestedFilters?: string[];
}

export interface ShopDisplay {
  type: "products";
  data: ShopData;
}

export function isShopRequest(text: string): boolean {
  const shopKeywords = [
    "buy",
    "shop",
    "purchase",
    "find",
    "search",
    "recommend",
    "suggest",
    "amazon",
    "product",
    "shopping",
  ];
  const lowercaseText = text.toLowerCase();
  return shopKeywords.some((keyword) => lowercaseText.includes(keyword));
}

export function formatShopMessage(shopDisplay: ShopDisplay): string {
  const { query, products } = shopDisplay.data;
  return (
    `Here are some products I found for "${query}":\n\n` +
    products
      .map(
        (product: Product) =>
          `${product.name}\n` +
          `Price: $${product.price}\n` +
          `Rating: ${product.rating}/5 ${
            product.reviews ? `(${product.reviews} reviews)` : ""
          }\n` +
          `${product.prime ? "✓ Prime Shipping\n" : ""}` +
          `${product.url}\n`
      )
      .join("\n")
  );
}
