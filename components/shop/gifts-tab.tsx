import { ShopCard } from "./shop-card";

const gifts = [
  {
    name: "Friendship Bracelet",
    description: "Glows with daily affirmations, changes color with mood",
    price: 100,
    image: "/placeholder.svg?text=Friendship+Bracelet",
  },
  {
    name: "Digital Garden",
    description: "Virtual flowers grow with achievements",
    price: 200,
    image: "/placeholder.svg?text=Digital+Garden",
  },
  {
    name: "Musical Box",
    description: "Custom tunes based on mood, unlocks new melodies",
    price: 300,
    image: "/placeholder.svg?text=Musical+Box",
  },
  {
    name: "Spirit Animal",
    description: "Interacts with Zoey, provides encouragement",
    price: 400,
    image: "/placeholder.svg?text=Spirit+Animal",
  },
  {
    name: "Memory Locket",
    description: "Stores achievements, creates visual timeline",
    price: 500,
    image: "/placeholder.svg?text=Memory+Locket",
  },
  {
    name: "Enchanted Mirror",
    description: "Shows affirmations, creates fun selfie filters",
    price: 600,
    image: "/placeholder.svg?text=Enchanted+Mirror",
  },
  {
    name: "Dream Catcher",
    description: "Displays weekly goals achieved",
    price: 700,
    image: "/placeholder.svg?text=Dream+Catcher",
  },
  {
    name: "Celestial Observatory",
    description: "Personal star map growing with achievements",
    price: 800,
    image: "/placeholder.svg?text=Celestial+Observatory",
  },
  {
    name: "Time Capsule",
    description: "Stores memories, creates surprise celebrations",
    price: 900,
    image: "/placeholder.svg?text=Time+Capsule",
  },
  {
    name: "Crown of Achievement",
    description: "Customizable, changes with accomplishments",
    price: 1000,
    image: "/placeholder.svg?text=Crown+of+Achievement",
  },
];

export function GiftsTab() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
      {gifts.map((gift) => (
        <ShopCard key={gift.name} item={gift} />
      ))}
    </div>
  );
}
