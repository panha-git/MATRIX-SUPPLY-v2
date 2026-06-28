import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { MarketplaceProvider } from "@/components/MarketplaceProvider";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SUPPY Matrix | Cambodia's Food Marketplace",
  description:
    "Fresh produce, quality ingredients, and trusted local suppliers across Cambodia.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <body>
        <MarketplaceProvider>{children}</MarketplaceProvider>
      </body>
    </html>
  );
}
