import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "XFlux — Affordable X/Twitter API Proxy",
  description:
    "Cheap, stable X/Twitter API proxy for scraping, search, monitoring, and automation. 90% cheaper than official API.",
  keywords: ["Twitter API", "X API", "API proxy", "social media automation"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
