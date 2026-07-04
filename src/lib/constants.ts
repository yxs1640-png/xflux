export const PLANS = [
  {
    id: "FREE",
    name: "Free",
    price: 0,
    quota: "1,000",
    monitors: 1,
    features: [
      "Basic search & scrape",
      "1 monitor task",
      "Community support",
      "API documentation",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    id: "BASIC",
    name: "Basic",
    price: 19,
    quota: "50,000",
    monitors: 5,
    features: [
      "Batch operations",
      "5 monitor tasks",
      "Email notifications",
      "Webhook support",
      "Priority queue",
    ],
    cta: "Start Basic",
    highlighted: false,
  },
  {
    id: "PRO",
    name: "Pro",
    price: 99,
    quota: "500,000",
    monitors: 20,
    features: [
      "All features unlocked",
      "20 monitor tasks",
      "All notification channels",
      "Real-time WebSocket",
      "Priority support",
    ],
    cta: "Go Pro",
    highlighted: true,
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    price: 499,
    quota: "Unlimited",
    monitors: 999,
    features: [
      "Dedicated infrastructure",
      "Custom SLA (99.9%)",
      "White-label options",
      "Team collaboration",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
] as const;

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
    description: "Post a new tweet",
    body: '{ "text": "Hello from XFlux!" }',
  },
];

export const STATS = [
  { label: "API Calls", value: "12M+" },
  { label: "Uptime SLA", value: "99.9%" },
  { label: "DM Delivery", value: "98%" },
  { label: "Cost Savings", value: "90%" },
];
