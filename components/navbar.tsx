"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Rubik_Doodle_Shadow } from "next/font/google";
import { useMode } from "@/contexts/ModeContext";
import { User, CoinsIcon as Coin } from "lucide-react";
import { ConnectEmbed } from "thirdweb/react";
import { client } from "@/lib/thirdweb";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";

const rubikDoodleShadow = Rubik_Doodle_Shadow({
  weight: "400",
  subsets: ["latin"],
});

const navItems = [
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
  const router = useRouter();
  const { activeMode, activeColor, activeLightColor } = useMode();
  const account = useActiveAccount();
  const activeWallet = useActiveWallet();
  const [showConnectEmbed, setShowConnectEmbed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (account) {
      setShowConnectEmbed(false);
    }
  }, [account]);

  const handleLogout = async () => {
    try {
      if (activeWallet) {
        await activeWallet.disconnect();
      }
      router.refresh();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Prevent hydration issues by not rendering wallet-related UI until mounted
  const renderAuthButton = () => {
    if (!mounted) {
      return (
        <div className="w-[100px] h-[42px] bg-white border-2 border-black rounded-md shadow-brutal" />
      );
    }

    if (account) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 bg-white border-2 border-black rounded-full shadow-brutal hover:bg-gray-50 focus:outline-none">
            <User className="w-6 h-6 text-black" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white border-2 border-black rounded-lg shadow-brutal">
            <DropdownMenuItem className="hover:bg-gray-100 focus:bg-gray-100 focus:outline-none cursor-pointer">
              My Account
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-100 focus:bg-gray-100 focus:outline-none cursor-pointer">
              {account.address.slice(0, 6)}...{account.address.slice(-4)}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-black" />
            <DropdownMenuItem
              className="hover:bg-gray-100 focus:bg-gray-100 focus:outline-none cursor-pointer"
              onClick={handleLogout}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <>
        <button
          onClick={() => setShowConnectEmbed(true)}
          className="px-4 py-2 text-lg font-bold bg-white border-2 border-black rounded-md shadow-brutal hover:bg-gray-50"
        >
          Login
        </button>
        <Dialog open={showConnectEmbed} onOpenChange={setShowConnectEmbed}>
          <DialogContent className="bg-white border-2 border-black rounded-lg shadow-brutal sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center">
                Connect Wallet
              </DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <ConnectEmbed
                client={client}
                theme="light"
                onConnect={() => setShowConnectEmbed(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  };

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
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-lg font-display font-bold transition-colors border-2 border-black rounded-md hover:bg-opacity-80",
                  pathname === item.href
                    ? "text-black shadow-brutal"
                    : "bg-white text-foreground hover:bg-gray-50"
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
          <div className="flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-full shadow-brutal">
            <Coin className="w-6 h-6 text-black" />
            <span className="text-lg font-bold">1000</span>
          </div>
          {renderAuthButton()}
        </div>
      </div>
    </nav>
  );
}
