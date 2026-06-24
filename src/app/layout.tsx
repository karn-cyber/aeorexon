import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompareBar } from "@/components/product/CompareBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aorexon — Industrial Equipment, Ordered Intelligently",
  description:
    "Use-case-first ordering for SEKO / Water & Industry dosing pumps, motor pumps, peristaltic pumps, controllers and accessories. Describe what you need — we find the right product.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-text">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CompareBar />
      </body>
    </html>
  );
}
