"use client";

import { useState } from "react";
import { useMode } from "@/contexts/ModeContext";
import { Nav } from "@/components/navbar";
import { AbilitiesTab } from "@/components/shop/abilities-tab";
import { GiftsTab } from "@/components/shop/gifts-tab";

export default function ShopPage() {
  const { activeLighterColor, activeColor } = useMode();
  const [activeTab, setActiveTab] = useState<"abilities" | "gifts">(
    "abilities"
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main
        className="flex-1 flex flex-col"
        style={{ backgroundColor: activeLighterColor }}
      >
        <div className="container py-8">
          <h1 className="text-4xl font-display mb-4">Zoey's Shop</h1>
          <div className="mb-4 flex space-x-4">
            <button
              onClick={() => setActiveTab("abilities")}
              className={`px-4 py-2 rounded-md font-bold transition-colors ${
                activeTab === "abilities" ? "text-white" : "text-black"
              }`}
              style={{
                backgroundColor:
                  activeTab === "abilities" ? activeColor : "transparent",
              }}
            >
              Abilities
            </button>
            <button
              onClick={() => setActiveTab("gifts")}
              className={`px-4 py-2 rounded-md font-bold transition-colors ${
                activeTab === "gifts" ? "text-white" : "text-black"
              }`}
              style={{
                backgroundColor:
                  activeTab === "gifts" ? activeColor : "transparent",
              }}
            >
              Gifts
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pt-2">
          <div className="container pb-8">
            {activeTab === "abilities" ? <AbilitiesTab /> : <GiftsTab />}
          </div>
        </div>
      </main>
    </div>
  );
}
