export const PLANS = [
  {
    id: "FREE",
    name: "Free",
    price: 0,
    quota: "1,000",
    monitors: 1,
    features: [
      "Search & user lookup",
      "1 account monitor",
      "Dashboard hit history",
      "Self-serve documentation",
    ],
    cta: "Start Free — No card",
    highlighted: false,
  },
  {
    id: "BASIC",
    name: "Starter",
    price: 19,
    quota: "150,000",
    monitors: 3,
    features: [
      "150K API calls / month",
      "3 account monitors",
      "Signed HTTP webhooks",
      "120s min poll interval",
    ],
    cta: "Start Starter",
    highlighted: false,
  },
  {
    id: "GROWTH",
    name: "Growth",
    price: 49,
    quota: "500,000",
    monitors: 8,
    features: [
      "500K API calls / month",
      "8 account monitors",
      "Signed HTTP webhooks",
      "60s min poll interval",
    ],
    cta: "Get Growth",
    highlighted: false,
  },
  {
    id: "PRO",
    name: "Pro",
    price: 99,
    quota: "1,200,000",
    monitors: 20,
    features: [
      "1.2M API calls / month",
      "20 account monitors",
      "Signed HTTP webhooks",
      "30s min poll interval",
    ],
    cta: "Go Pro",
    highlighted: true,
  },
  {
    id: "SCALE",
    name: "Scale",
    price: 249,
    quota: "4,000,000",
    monitors: 50,
    features: [
      "4M API calls / month",
      "50 account monitors",
      "Signed HTTP webhooks",
      "15s min poll interval",
    ],
    cta: "Go Scale",
    highlighted: false,
  },
] as const;

export const PAID_PLAN_COMING_SOON_LABEL = "Coming soon";

const PLAN_NAME_BY_ID = Object.fromEntries(PLANS.map((p) => [p.id, p.name])) as Record<
  string,
  string
>;

/** User-facing plan label (e.g. BASIC → Starter). */
export function getPlanDisplayName(planTier: string): string {
  return PLAN_NAME_BY_ID[planTier] ?? planTier;
}

export const API_ENDPOINTS = [
  {
    method: "GET",
    path: "/api/v1/users/:username",
    description: "Get user profile by username",
  },
  {
    method: "GET",
    path: "/api/v1/users/:username/tweets",
    description: "Get user timeline tweets",
  },
  {
    method: "GET",
    path: "/api/v1/tweets/:id",
    description: "Get tweet by ID",
  },
  {
    method: "GET",
    path: "/api/v1/search",
    description: "Search tweets by query",
    params: "?q=keyword&limit=20",
  },
  {
    method: "POST",
    path: "/api/v1/tweets",
    description: "Post a new tweet (coming soon)",
    body: '{ "text": "Hello from XFlux!" }',
  },
];

export const STATS = [
  { label: "Free Monthly Quota", value: "1,000" },
  { label: "Paid Plans From", value: "$19/mo" },
  { label: "Signup Approval", value: "Instant" },
  { label: "Monitors + Webhooks", value: "Included" },
];

/** Plans shown on the homepage pricing teaser (Free + highlighted tier). */
export function getHomepagePlans() {
  const highlighted = PLANS.find((p) => p.highlighted);
  return [PLANS[0], highlighted ?? PLANS[2]].filter(
    (plan, index, arr) => arr.findIndex((p) => p.id === plan.id) === index
  );
}
