"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

type Mode = {
  id: string;
  name: string;
};

const modes: Mode[] = [
  { id: "bff", name: "BFF" },
  { id: "manager", name: "Manager" },
  { id: "coach", name: "Coach" },
  { id: "nutritionist", name: "Nutritionist" },
  { id: "wellness", name: "Wellness" },
];

export function ModeSelector() {
  const [activeMode, setActiveMode] = useState("bff");

  return (
    <div className="w-64 border-r-2 border-black bg-white p-4 space-y-2">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => setActiveMode(mode.id)}
          className={cn(
            "w-full p-3 text-left font-display font-bold border-2 border-black rounded-lg transition-all",
            activeMode === mode.id
              ? "bg-primary text-primary-foreground shadow-brutal -translate-y-0.5"
              : "bg-white hover:bg-gray-50"
          )}
        >
          {mode.name}
        </button>
      ))}
    </div>
  );
}
