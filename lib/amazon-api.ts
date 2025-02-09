import crypto from "crypto";

interface AmazonCredentials {
  accessKey: string;
  secretKey: string;
  partnerTag: string;
  host: string;
}

const credentials: AmazonCredentials = {
  accessKey: process.env.AMAZON_ACCESS_KEY || "",
  secretKey: process.env.AMAZON_SECRET_KEY || "",
  partnerTag: process.env.AMAZON_PARTNER_TAG || "",
  host: "webservices.amazon.com",
};

function generateSignature(secretKey: string, stringToSign: string): string {
  return crypto
    .createHmac("sha256", secretKey)
    .update(stringToSign)
    .digest("base64");
}

export async function searchProducts(query: string) {
  const timestamp = new Date().toISOString().replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    Service: "ProductAdvertisingAPI",
    Operation: "SearchItems",
    PartnerTag: credentials.partnerTag,
    PartnerType: "Associates",
    Marketplace: "www.amazon.com",
    Keywords: query,
    SearchIndex: "All",
    Resources: [
      "Images.Primary.Large",
      "ItemInfo.Title",
      "ItemInfo.Features",
      "ItemInfo.ByLineInfo",
      "Offers.Listings.Price",
      "Offers.Listings.DeliveryInfo.IsPrimeEligible",
      "CustomerReviews.Count",
      "CustomerReviews.StarRating",
    ].join(","),
    AWSAccessKeyId: credentials.accessKey,
    Timestamp: timestamp,
  });

  const stringToSign = [
    "GET",
    credentials.host,
    "/paapi5/searchitems",
    params.toString(),
  ].join("\n");

  const signature = generateSignature(credentials.secretKey, stringToSign);
  params.append("Signature", signature);

  const url = `https://${
    credentials.host
  }/paapi5/searchitems?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Amazon API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform the response into our Product type
    return data.SearchResult.Items.map((item: any) => ({
      id: item.ASIN,
      name: item.ItemInfo.Title.DisplayValue,
      description: item.ItemInfo.Features
        ? item.ItemInfo.Features[0]
        : item.ItemInfo.Title.DisplayValue,
      price: item.Offers?.Listings[0]?.Price?.Amount || 0,
      rating: item.CustomerReviews?.StarRating?.Value || 0,
      reviews: item.CustomerReviews?.Count || 0,
      imageUrl: item.Images.Primary.Large.URL,
      url: item.DetailPageURL,
      prime: item.Offers?.Listings[0]?.DeliveryInfo?.IsPrimeEligible || false,
    }));
  } catch (error) {
    console.error("Amazon API search error:", error);
    throw error;
  }
}
