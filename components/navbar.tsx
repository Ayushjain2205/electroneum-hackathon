"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Talk", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Memory", href: "/memory" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b-2 border-black bg-white">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/zoey.svg" alt="Zoey" className="h-10" />
        </Link>
        <div className="flex gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 text-lg font-display transition-colors border-2 border-black rounded-md hover:bg-primary hover:text-primary-foreground",
                pathname === item.href
                  ? "bg-primary text-primary-foreground shadow-brutal"
                  : "bg-white text-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
