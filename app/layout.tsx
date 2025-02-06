import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="min-h-screen bg-[#FFFAF0] font-sans">{children}</body>
    </html>
  );
}
