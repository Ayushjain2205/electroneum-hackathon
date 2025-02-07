"use client";

import { useState } from "react";
import Image from "next/image";
import { CoinsIcon } from "lucide-react";
import { useMode } from "@/contexts/ModeContext";

interface ShopCardProps {
  item: {
    name: string;
    description: string;
    price: number;
    image: string;
  };
}

export function ShopCard({ item }: ShopCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { activeColor } = useMode();

  return (
    <div
      className="relative bg-white border-2 border-black rounded-md shadow-brutal overflow-hidden transition-all duration-300 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transform: isHovered ? "translateY(-5px)" : "translateY(0)" }}
    >
      <Image
        src={item.image || "/placeholder.svg"}
        alt={item.name}
        width={300}
        height={300}
        className="w-full h-40 object-cover"
      />
      <div className="p-2">
        <h3 className="text-sm font-bold truncate">{item.name}</h3>
      </div>
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-75 p-4 flex flex-col justify-center transition-opacity duration-300 ease-in-out">
          <p className="text-sm text-white">{item.description}</p>
        </div>
      )}
      <button
        className="absolute bottom-2 right-2 flex items-center px-3 py-2 rounded-md text-white font-bold transition-colors"
        style={{ backgroundColor: activeColor }}
      >
        <CoinsIcon className="w-4 h-4 mr-1" />
        <span>{item.price}</span>
      </button>
    </div>
  );
}
