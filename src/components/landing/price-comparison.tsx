import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ROWS = [
  { feature: "Monthly entry price", official: "$100+/mo", xflux: "Free, then from $19" },
  { feature: "Approval process", official: "Application required", xflux: "Instant signup" },
  { feature: "Account monitors", official: "Not included", xflux: "Built-in + webhooks" },
  { feature: "Free tier", official: "Limited / none", xflux: "1,000 calls/mo" },
  { feature: "Credit card to start", official: "Usually required", xflux: "Not required" },
];

export function PriceComparison({ registerHref = "/register?src=homepage_compare" }: { registerHref?: string }) {
  return (
    <section className="py-24 border-y border-zinc-800 bg-zinc-900/20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Why developers choose XFlux
          </h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
            Official X API pricing and approval can slow you down. XFlux is built for teams that
            need read access and monitors without the enterprise overhead.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-800">
          <div className="grid grid-cols-3 bg-zinc-900/60 text-sm font-medium">
            <div className="px-4 py-3 text-zinc-500" />
            <div className="px-4 py-3 text-center text-zinc-400 border-l border-zinc-800">
              Official X API
            </div>
            <div className="px-4 py-3 text-center text-sky-400 border-l border-zinc-800">
              XFlux
            </div>
          </div>
          {ROWS.map((row) => (
            <div
              key={row.feature}
              className="grid grid-cols-3 border-t border-zinc-800 text-sm"
            >
              <div className="px-4 py-4 text-zinc-300">{row.feature}</div>
              <div className="px-4 py-4 text-center text-zinc-500 border-l border-zinc-800 flex items-center justify-center gap-2">
                <X className="h-4 w-4 shrink-0 text-zinc-600" />
                {row.official}
              </div>
              <div className="px-4 py-4 text-center text-zinc-200 border-l border-zinc-800 flex items-center justify-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-sky-400" />
                {row.xflux}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href={registerHref}>
            <Button size="lg">
              Start free — no credit card
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
