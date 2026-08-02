import { Sparkles, Check } from "lucide-react";
import { HeroActions } from "@/components/landing/hero-actions";
import { ApiPlayground } from "@/components/landing/api-playground";

const TRUST_POINTS = [
  "1,000 free API calls / month",
  "Profile, search & timeline REST API",
  "Monitors + signed webhooks (paid)",
];

export function Hero({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-zinc-950 to-zinc-950" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-sky-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-sm text-sky-400 mb-6">
              <Sparkles className="h-4 w-4" />
              Twitter / X data API
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
              X/Twitter data API{" "}
              <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                for profiles, search, timelines &amp; monitors
              </span>
            </h1>

            <p className="mt-6 text-lg text-zinc-400 leading-relaxed">
              Stable REST endpoints that return normalized JSON for search, analytics, and AI
              pipelines — plus account monitors with signed HTTP webhooks.{" "}
              <span className="text-zinc-300">No official X API approval required.</span>
            </p>

            <HeroActions isLoggedIn={isLoggedIn} />

            <ul className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-zinc-500">
              {TRUST_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-sky-400 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:pl-4">
            <ApiPlayground />
          </div>
        </div>
      </div>
    </section>
  );
}
