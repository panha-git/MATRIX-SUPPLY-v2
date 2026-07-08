import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { MarketplaceProvider } from "@/components/MarketplaceProvider";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MATRIX SUPPLY | Local Supplier Marketplace",
  description:
    "A browser-only supplier marketplace demo with product approvals, customer carts, and order requests.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <body>
        <AuthProvider>
          <MarketplaceProvider>{children}</MarketplaceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
