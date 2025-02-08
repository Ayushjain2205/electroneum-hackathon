import { ShopCard } from "./shop-card";

const boosts = [
  {
    name: "1-Day Boost",
    description: "Enhance your attributes for 24 hours",
    price: 100,
    image: "/placeholder.svg?text=1-Day+Boost",
  },
  {
    name: "3-Day Boost",
    description: "Supercharge your abilities for 3 days",
    price: 250,
    image: "/placeholder.svg?text=3-Day+Boost",
  },
  {
    name: "5-Day Boost",
    description: "Elevate your skills for 5 days straight",
    price: 400,
    image: "/placeholder.svg?text=5-Day+Boost",
  },
  {
    name: "7-Day Boost",
    description: "Maximum power boost for an entire week",
    price: 500,
    image: "/placeholder.svg?text=7-Day+Boost",
  },
];

export function BoostsTab() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
      {boosts.map((boost) => (
        <ShopCard key={boost.name} item={boost} />
      ))}
    </div>
  );
}
