import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompareBar } from "@/components/product/CompareBar";
import { HelpCallButton } from "@/components/layout/HelpCallButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aorexon Systems — Engineering Solutions. Delivering Excellence.",
  description:
    "High-precision industrial solutions: SEKO dosing pumps & controllers, PNG gas pipeline installation, URB bearings, and architectural-grade seating.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${mono.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col bg-bg text-text">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CompareBar />
          <HelpCallButton />
        </body>
      </html>
    </ClerkProvider>
  );
}
