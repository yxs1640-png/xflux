import { Sparkles, Check } from "lucide-react";
import { LEGAL } from "@/lib/legal-config";
import { HeroActions } from "@/components/landing/hero-actions";

const TRUST_POINTS = [
  "Free forever tier",
  "No credit card",
  "API key in under 60 seconds",
];

export function Hero({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-zinc-950 to-zinc-950" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-sky-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-sm text-sky-400 mb-8">
          <Sparkles className="h-4 w-4" />
          Read API + account monitors
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
          The Affordable{" "}
          <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
            X/Twitter API
          </span>
          <br />
          Proxy You Need
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
          Official X API is expensive and slow to approve. XFlux gives you profiles, timelines,
          search, and account monitors —{" "}
          <span className="text-zinc-300">1,000 free calls/month, no credit card.</span>
        </p>

        <HeroActions isLoggedIn={isLoggedIn} />

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
          {TRUST_POINTS.map((point) => (
            <li key={point} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-sky-400" />
              {point}
            </li>
          ))}
        </ul>

        <div className="mt-16 mx-auto max-w-3xl">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 text-left font-mono text-sm">
            <div className="text-zinc-500 mb-2"># Quick start</div>
            <div className="text-sky-400">
              curl -H &quot;Authorization: Bearer xflux_YOUR_KEY&quot; \<br />
              &nbsp;&nbsp;{LEGAL.website}/api/v1/users/elonmusk
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
