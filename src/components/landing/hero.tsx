import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-zinc-950 to-zinc-950" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-sky-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-sm text-sky-400 mb-8">
          <Sparkles className="h-4 w-4" />
          90% cheaper than official X API
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
          XFlux delivers stable, developer-friendly access to X/Twitter data and automation.
          Scrape, search, monitor KOLs, and automate posting — all through one simple API.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={isLoggedIn ? "/dashboard" : "/register"}>
            <Button size="lg" className="min-w-[180px]">
              {isLoggedIn ? "Go to Dashboard" : "Start Free"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="outline" size="lg" className="min-w-[180px]">
              View Documentation
            </Button>
          </Link>
        </div>

        <div className="mt-16 mx-auto max-w-3xl">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 text-left font-mono text-sm">
            <div className="text-zinc-500 mb-2"># Quick start</div>
            <div className="text-sky-400">
              curl -H &quot;Authorization: Bearer xflux_YOUR_KEY&quot; \<br />
              &nbsp;&nbsp;https://api.xflux.dev/v1/users/elonmusk
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
