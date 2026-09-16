import type { PredictorNiche } from "@prisma/client";

/** Seed accounts and search queries per niche for discovery runs. */
export const NICHE_SEEDS: Record<
  PredictorNiche,
  { accounts: string[]; searchQueries: string[] }
> = {
  MACRO: {
    accounts: ["elerianm", "DeItaone", "federalreserve", "NorthmanTrader", "MacroAlf"],
    searchQueries: [
      '(fed OR CPI OR inflation OR "rate cut") (will OR expect OR predict OR forecast) lang:en -filter:replies',
      '(FOMC OR treasury OR yields) (see OR expect OR call) lang:en -filter:replies',
    ],
  },
  TRADING: {
    accounts: ["unusual_whales", "DeItaone", "zerohedge", "PelosiTracker_", "SpotGamma"],
    searchQueries: [
      '($SPY OR $QQQ OR stocks OR market) (will OR expect OR rally OR crash OR target) lang:en -filter:replies',
      '(earnings OR guidance OR EPS) (beat OR miss OR expect) lang:en -filter:replies',
    ],
  },
  CRYPTO: {
    accounts: ["lookonchain", "whale_alert", "WuBlockchain", "CryptoKaleo", "blknoiz06"],
    searchQueries: [
      '(bitcoin OR BTC OR ethereum OR ETH) (will OR hit OR target OR rally OR dump) lang:en -filter:replies',
      '(ETF OR halving OR liquidation) (expect OR predict OR see) lang:en -filter:replies',
    ],
  },
  GEOPOLITICS: {
    accounts: ["zerohedge", "DeItaone", "WarMonitors", "IntelCrab"],
    searchQueries: [
      '(war OR sanction OR tariff OR oil OR china) (will OR expect OR escalate OR risk) lang:en -filter:replies',
      '("risk off" OR geopolitics OR middle east) (predict OR forecast OR see) lang:en -filter:replies',
    ],
  },
};

export function allSeedAccounts(): Array<{ username: string; niche: PredictorNiche }> {
  const out: Array<{ username: string; niche: PredictorNiche }> = [];
  const seen = new Set<string>();

  for (const niche of Object.keys(NICHE_SEEDS) as PredictorNiche[]) {
    for (const username of NICHE_SEEDS[niche].accounts) {
      const key = username.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ username: key, niche });
    }
  }
  return out;
}
