import { Space_Grotesk, Outfit } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";
import { ModeProvider } from "@/contexts/ModeContext";
import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "@/components/ui/toaster";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-[#FFFAF0] font-sans">
        <ThirdwebProvider>
          <ModeProvider>
            {children}
            <Toaster />
          </ModeProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
