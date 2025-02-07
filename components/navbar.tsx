"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rubik_Doodle_Shadow } from "next/font/google";
import { useMode } from "@/contexts/ModeContext";

const rubikDoodleShadow = Rubik_Doodle_Shadow({
  weight: "400",
  subsets: ["latin"],
});

const navItems = [
  { name: "Talk", href: "/talk" },
  { name: "Shop", href: "/shop" },
  { name: "Memory", href: "/memory" },
];

const modeIcons = {
  bff: "https://img.icons8.com/wired/64/like--v1.png",
  manager: "https://img.icons8.com/wired/64/briefcase.png",
  coach: "https://img.icons8.com/wired/64/brain.png",
  nutritionist: "https://img.icons8.com/wired/64/apple.png",
  wellness: "https://img.icons8.com/wired/64/spa-flower.png",
};

export function Nav() {
  const pathname = usePathname();
  const { activeMode, activeColor, activeLightColor } = useMode();

  return (
    <nav
      className="w-full h-16 border-b-2 border-black transition-colors duration-300 ease-in-out"
      style={{ backgroundColor: activeLightColor }}
    >
      <div className="container h-full flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <span
              className={`text-4xl font-bold ${rubikDoodleShadow.className} text-black`}
            >
              Zoey
            </span>
            <img
              className="w-8 h-8"
              src={modeIcons[activeMode] || "/placeholder.svg"}
              alt={`${activeMode} mode icon`}
            />
          </div>
        </Link>
        <div className="flex gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 text-lg font-display font-bold transition-colors border-2 border-black rounded-md hover:bg-opacity-80",
                pathname === item.href
                  ? "text-black shadow-brutal"
                  : "bg-white text-foreground hover:bg-gray-100"
              )}
              style={{
                backgroundColor:
                  pathname === item.href ? activeColor : undefined,
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
