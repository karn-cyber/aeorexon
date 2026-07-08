import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

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
        <body className="min-h-full bg-bg text-text">{children}</body>
      </html>
    </ClerkProvider>
  );
}
