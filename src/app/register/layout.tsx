import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Create Free Account",
  description:
    "Sign up for XFlux and get your API key in under a minute. 1,000 free API calls per month, no credit card required.",
  path: "/register",
});

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
