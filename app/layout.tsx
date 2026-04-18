import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Townshub — Faceless Video Studio",
    template: "%s | Townshub",
  },
  description:
    "Generate scripts, voiceovers, thumbnails and manage your faceless YouTube channel end-to-end with AI. Powered by Townshub.",
  keywords: [
    "YouTube", "faceless channel", "AI scripts", "voiceover", "content creation",
    "thumbnails", "video scheduler", "Townshub",
  ],
  authors: [{ name: "Townshub", url: "https://townshub.com" }],
  creator: "Townshub",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://townshub-faceless.vercel.app"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Townshub — Faceless Video Studio",
    description:
      "AI-powered YouTube studio. Scripts, voiceovers, thumbnails, scheduling and social publishing — all in one place.",
    siteName: "Townshub",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Townshub Faceless Video Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Townshub — Faceless Video Studio",
    description:
      "AI-powered YouTube studio. Scripts, voiceovers, thumbnails, scheduling and social publishing.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: { url: "/logo.svg", type: "image/svg+xml" },
    shortcut: "/logo.svg",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <meta name="application-name" content="Townshub" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Townshub" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#080D1A" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="min-h-screen bg-[#080D1A] text-[#E8F0FF] font-dm antialiased">
        {children}
      </body>
    </html>
  );
}
