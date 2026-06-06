import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import TravelAgent from "@/components/TravelAgent";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TripMind AI - Smart Travel Itinerary Planner",
  description: "AI-powered travel planning made simple",
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
        <body className={inter.className}>
  {children}
  <TravelAgent />
</body>
      </html>
    </ClerkProvider>
  );
}