import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import TravelAgent from "@/components/TravelAgent";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "TripMind AI — Plan Your Dream Trip in 30 Seconds",
  description: "TripMind AI creates fully personalized travel itineraries, finds the best deals, and manages your entire journey — all powered by AI. Free to start.",
  keywords: "AI travel planner, trip itinerary generator, personalized travel, travel planning AI, automatic itinerary",
  authors: [{ name: "TripMind AI" }],
  creator: "TripMind AI",
  metadataBase: new URL("https://tripmind-ai-kappa.vercel.app"),
  openGraph: {
    title: "TripMind AI — Plan Your Dream Trip in 30 Seconds",
    description: "AI-powered travel planning. Get a full day-by-day itinerary with hotels, flights, food and activities in under 30 seconds.",
    url: "https://tripmind-ai-kappa.vercel.app",
    siteName: "TripMind AI",
    images: [
      {
        url: "https://images.unsplash.com/photo-1499856871958-5b9357976b82?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "TripMind AI - Smart Travel Planner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TripMind AI — Plan Your Dream Trip in 30 Seconds",
    description: "AI-powered travel planning. Full itinerary with hotels, flights, food and activities in under 30 seconds.",
    images: ["https://images.unsplash.com/photo-1499856871958-5b9357976b82?q=80&w=1200"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: "JGMyCk3xQNHqOxw34Yz5t-WY8PcWMcVowV-O7FPTf50",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-TK9MRNG0F1"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TK9MRNG0F1');
            `}
          </Script>
        </head>
        <body className={plusJakarta.className}>
          {children}
          <TravelAgent />
        </body>
      </html>
    </ClerkProvider>
  );
}