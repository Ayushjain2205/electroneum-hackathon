import { ShopCard } from "./shop-card";

const abilities = [
  {
    name: "Novice Pack",
    description: "+5 to any attribute, 1 random boost, Basic training guide",
    price: 500,
    image: "/abilities/ability1.png",
  },
  {
    name: "Adept Bundle",
    description: "+10 to any attribute, 2 random boosts, Intermediate guide",
    price: 1000,
    image: "/abilities/ability2.png",
  },
  {
    name: "Master's Cache",
    description: "+20 to any attribute, 3 premium boosts, Advanced techniques",
    price: 2000,
    image: "/abilities/ability3.png",
  },
  {
    name: "Ultimate Upgrade",
    description: "+50 to any attribute, Full boost set, Expert mastery guide",
    price: 5000,
    image: "/abilities/ability4.png",
  },
];

export function AbilitiesTab() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
      {abilities.map((ability) => (
        <ShopCard key={ability.name} item={ability} />
      ))}
    </div>
  );
}
