"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";
import { modeColors, type ModeType } from "@/lib/colors";

type ModeContextType = {
  activeMode: ModeType;
  setActiveMode: (mode: ModeType) => void;
  activeColor: string;
  activeLightColor: string;
};

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [activeMode, setActiveMode] = useState<ModeType>("bff");

  const value = {
    activeMode,
    setActiveMode,
    activeColor: modeColors[activeMode].main,
    activeLightColor: modeColors[activeMode].light,
  };

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return context;
}
