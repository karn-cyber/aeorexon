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

const SITE_URL = "https://www.aorexonsystems.in";
const DESCRIPTION =
  "Aorexon Systems — SEKO dosing pumps & water-quality controllers, PNG gas pipeline installation, URB industrial bearings, and Lynchpin furniture. Engineering Solutions. Delivering Excellence.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aorexon Systems — Dosing Pumps, Pipelines, Bearings & Furniture",
    template: "%s | Aorexon Systems",
  },
  description: DESCRIPTION,
  applicationName: "Aorexon Systems",
  keywords: [
    "dosing pumps",
    "SEKO dosing pump",
    "water quality controller",
    "PNG gas pipeline installation",
    "URB bearings",
    "peristaltic pump",
    "solenoid dosing pump",
    "chemical dosing India",
    "café chairs",
    "office chairs",
    "Aorexon Systems",
    "industrial equipment supplier India",
  ],
  authors: [{ name: "Aorexon Systems" }],
  creator: "Aorexon Systems",
  publisher: "Aorexon Systems",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Aorexon Systems",
    url: SITE_URL,
    title: "Aorexon Systems — Engineering Solutions. Delivering Excellence.",
    description: DESCRIPTION,
    locale: "en_IN",
    images: [{ url: "/hero/dosing-pump.jpg", width: 1400, height: 933, alt: "Aorexon Systems dosing pump" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aorexon Systems — Engineering Solutions. Delivering Excellence.",
    description: DESCRIPTION,
    images: ["/hero/dosing-pump.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: { icon: "/favicon.ico" },
  category: "Industrial Equipment",
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
