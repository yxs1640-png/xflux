import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { Callout, DocHeading } from "@/components/docs/doc-blocks";

export const metadata = pageMetadata({
  title: "Trading Monitor Keyword Templates",
  description:
    "Copy-paste keyword filters for XFlux account monitors: macro, options flow, earnings, crypto, and memecoin alerts from X/Twitter.",
  path: "/docs/guides/trading-keywords",
  keywords: [
    "twitter monitor keywords",
    "trading alert keywords",
    "macro twitter filter",
    "stock ticker monitor x",
  ],
});

const TEMPLATES = [
  {
    id: "macro",
    title: "Macro & rates",
    accounts: ["elerianm", "DeItaone", "federalreserve"],
    keywords: "fed, rate, inflation, CPI, PPI, GDP, jobs, treasury, yield, FOMC",
    tip: "Broad macro terms catch Fed commentary and data-drop reactions.",
  },
  {
    id: "flow",
    title: "Options flow & sweeps",
    accounts: ["unusual_whales", "SpotGamma", "OptionsHawk"],
    keywords: "flow, sweep, block, call, put, gamma, open interest",
    tip: "Filters out generic market tweets — keeps flow-specific posts.",
  },
  {
    id: "earnings",
    title: "Earnings & guidance",
    accounts: ["DeItaone", "FirstSquawk", "LiveSquawk"],
    keywords: "earnings, EPS, guidance, beat, miss, revenue, outlook",
    tip: "Pair with a breaking-news account for headline speed.",
  },
  {
    id: "indices",
    title: "Index & sector moves",
    accounts: ["DeItaone", "zerohedge"],
    keywords: "$SPY, $QQQ, $IWM, S&P, Nasdaq, sector rotation",
    tip: "Include cashtag-style terms if the account uses them.",
  },
  {
    id: "crypto",
    title: "Bitcoin & majors",
    accounts: ["lookonchain", "whale_alert", "WuBlockchain"],
    keywords: "bitcoin, BTC, ethereum, ETH, ETF, halving, liquidation",
    tip: "On-chain alert accounts often post every transfer — keywords reduce noise.",
  },
  {
    id: "memecoins",
    title: "Memecoin & alt KOLs",
    accounts: ["blknoiz06", "CryptoKaleo"],
    keywords: "SOL, memecoin, pump, launch, CA, contract",
    tip: "Highly volatile — narrow keywords to specific chains or tickers you trade.",
  },
  {
    id: "geopolitics",
    title: "Geopolitics & risk-off",
    accounts: ["zerohedge", "DeItaone"],
    keywords: "war, sanction, tariff, oil, risk-off, china, middle east",
    tip: "Useful for macro hedging workflows and volatility alerts.",
  },
] as const;

export default function TradingKeywordsPage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-4">Trading monitor keyword templates</h1>
      <p className="text-zinc-400 mb-6 leading-relaxed">
        XFlux monitors match keywords against new tweet text (case-insensitive, comma-separated).
        Copy a template below into the Dashboard{" "}
        <strong className="text-white">Keywords</strong> field when creating a monitor. Leave
        keywords empty to alert on every new tweet from the account.
      </p>

      <Callout title="How matching works">
        <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed">
          <li>Keywords are OR-matched — any term in the list can trigger a hit.</li>
          <li>First check sets a baseline; only tweets after that appear as hits.</li>
          <li>
            Live webhook delivery requires{" "}
            <Link href="/pricing" className="text-sky-400 hover:underline">
              Starter ($19/mo)
            </Link>{" "}
            or above.
          </li>
        </ul>
      </Callout>

      <DocHeading id="templates">Templates by strategy</DocHeading>
      <div className="space-y-6 mb-8">
        {TEMPLATES.map((t) => (
          <div key={t.id} id={t.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h3 className="text-lg font-semibold text-white mb-2">{t.title}</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-zinc-500">Suggested accounts</dt>
                <dd className="text-zinc-300">
                  {t.accounts.map((a) => (
                    <span key={a} className="inline-block mr-2">
                      @{a}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Keywords (copy-paste)</dt>
                <dd>
                  <code className="block rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 text-sky-300 text-xs break-all">
                    {t.keywords}
                  </code>
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Tip</dt>
                <dd className="text-zinc-400">{t.tip}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <DocHeading id="make">Route alerts to Slack or Telegram</DocHeading>
      <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
        After you configure a monitor, paste a Make.com Custom Webhook URL in the Dashboard. See the{" "}
        <Link href="/docs/integrations/make" className="text-sky-400 hover:underline">
          Make.com integration guide
        </Link>{" "}
        for step-by-step wiring.
      </p>

      <DocHeading id="related">Related</DocHeading>
      <ul className="list-disc list-inside space-y-2 text-sm text-zinc-400">
        <li>
          <Link href="/use-cases/trading-alerts" className="text-sky-400 hover:underline">
            Trading alerts use case
          </Link>
        </li>
        <li>
          <Link href="/signals/trading" className="text-sky-400 hover:underline">
            Live trading signal digest
          </Link>
        </li>
        <li>
          <Link href="/docs/monitors" className="text-sky-400 hover:underline">
            Monitor documentation
          </Link>
        </li>
        <li>
          <Link href="/docs/webhooks" className="text-sky-400 hover:underline">
            Webhook verification
          </Link>
        </li>
      </ul>
    </>
  );
}
