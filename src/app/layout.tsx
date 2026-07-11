import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "XFlux — Affordable X/Twitter API Proxy",
  description:
    "X/Twitter read API for profiles, timelines, and search, plus account monitors with optional signed HTTP webhooks on paid plans.",
  keywords: ["Twitter API", "X API", "API proxy", "Twitter monitoring", "webhooks"],
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
