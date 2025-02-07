"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMode } from "@/contexts/ModeContext";

const navItems = [
  { name: "Talk", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Memory", href: "/memory" },
];

export function Nav() {
  const pathname = usePathname();
  const { activeColor, activeLightColor } = useMode();

  return (
    <nav
      className="w-full h-16 border-b-2 border-black transition-colors duration-300 ease-in-out"
      style={{ backgroundColor: activeLightColor }}
    >
      <div className="container h-full flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/zoey.svg" alt="Zoey" className="h-10" />
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
