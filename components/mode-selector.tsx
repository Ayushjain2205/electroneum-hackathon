"use client";

import { cn } from "@/lib/utils";
import { useMode } from "@/contexts/ModeContext";
import { modeColors, type ModeType } from "@/lib/colors";
import Image from "next/image";

const modes: { id: ModeType; name: string }[] = [
  { id: "bff", name: "BFF" },
  { id: "manager", name: "Manager" },
  { id: "coach", name: "Coach" },
  { id: "nutritionist", name: "Nutritionist" },
  { id: "wellness", name: "Wellness" },
];

export function ModeSelector() {
  const { activeMode, setActiveMode, activeLightColor } = useMode();

  return (
    <div
      className="w-64 border-r-2 border-black p-4 flex flex-col justify-between h-full transition-colors duration-300 ease-in-out"
      style={{ backgroundColor: activeLightColor }}
    >
      <div className="space-y-2">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setActiveMode(mode.id)}
            className={cn(
              "w-full p-3 text-left font-display font-bold border-2 border-black rounded-lg transition-all",
              activeMode === mode.id
                ? "text-black shadow-brutal -translate-y-0.5"
                : "bg-white hover:bg-gray-50"
            )}
            style={{
              backgroundColor:
                activeMode === mode.id ? modeColors[mode.id].main : undefined,
            }}
          >
            {mode.name}
          </button>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <div className="w-64 h-64 relative">
          <Image
            src={`/modes/${activeMode}.svg`}
            alt={`${activeMode} mode`}
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
    </div>
  );
}
