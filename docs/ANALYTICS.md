# Analytics & Event Tracking

XFlux uses [PostHog](https://posthog.com) for product analytics. Events are defined in `src/lib/analytics/events.ts` and documented here.

## Setup

1. Create a PostHog project (US or EU cloud).
2. Copy the **Project API Key** (`phc_...`).
3. Add to `.env` / Vercel:

```env
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"   # or https://eu.i.posthog.com
```

4. Restart `npm run dev`. Without the key, all tracking calls no-op silently.

## Identity model

| Field | When set | Purpose |
|-------|----------|---------|
| `distinct_id` | Register / login | PostHog user id = `User.id` (cuid) |
| `signup_source` | Register | Attribution from registration form |
| `signup_source_detail` | Register (`other`) | Free-text channel detail |
| `plan_tier` | Register, billing webhooks | Current subscription tier |
| `email` | Identify on login | Cohort lookups (do not export casually) |

Anonymous visitors get a PostHog anonymous id until `identify()` on signup/login.

## Funnels to build in PostHog

### 1. Acquisition → Signup

```
$pageview (/) → cta_clicked → signup_completed
```

Break down `signup_completed` by `signup_source`.

### 2. Signup → Activation

```
signup_completed → api_key_created → monitor_created
```

Measures time-to-first-value.

### 3. Signup → Paid

```
signup_completed → plan_selected → checkout_started → checkout_completed
```

Break down by `plan_id` and `signup_source`.

### 4. Feedback loop

```
feedback_submitted
```

Properties: `core_needs`, `adoption_drivers`, `user_source`.

## Event catalog

### Acquisition

| Event | Trigger | Key properties |
|-------|---------|----------------|
| `$pageview` | Route change | `$current_url` |
| `cta_clicked` | Hero / header CTA | `cta`, `location`, `destination` |

### Auth

| Event | Trigger | Side | Key properties |
|-------|---------|------|----------------|
| `signup_completed` | Register API success | Server | `signup_source`, `signup_source_detail`, `has_utm` |
| `login_completed` | Login success | Client | — |

### Feedback

| Event | Trigger | Side | Key properties |
|-------|---------|------|----------------|
| `feedback_submitted` | Feedback API success | Server | `user_source`, `core_needs`, `adoption_drivers`, `has_message` |

### Billing

| Event | Trigger | Side | Key properties |
|-------|---------|------|----------------|
| `plan_selected` | Billing plan button click | Client | `plan_id`, `plan_name`, `action` |
| `checkout_started` | Stripe Checkout session created | Server | `plan_id` |
| `checkout_completed` | Return URL `?checkout=success` | Client | — |
| `checkout_canceled` | Return URL `?checkout=canceled` | Client | — |
| `subscription_updated` | Stripe webhook plan change | Server | `plan_id`, `subscription_status` |
| `subscription_canceled` | Stripe webhook cancel | Server | `previous_plan_id` |

### Product

| Event | Trigger | Key properties |
|-------|---------|----------------|
| `api_key_created` | New API key | `key_count` |
| `api_key_revoked` | Delete key | — |
| `monitor_created` | Create monitor | `has_keywords`, `has_webhook`, `check_interval` |
| `monitor_checked` | Manual Check now | `monitor_id`, `new_hits` |
| `webhook_configured` | Save webhook URL | `monitor_id` |
| `webhook_tested` | Test webhook | `success`, `status_code` |

## UTM & campaign links

PostHog captures standard UTM params on first touch automatically.

For registration source prefill, use:

```
/register?src=twitter_x&utm_source=twitter&utm_campaign=launch
```

`src` maps to the signup source dropdown; UTMs are attached to `signup_completed` as `utm_source`, `utm_medium`, `utm_campaign` when present in the request referrer context (via PostHog session).

## Source-of-truth rules

- **Conversion events** (signup, checkout, subscription): tracked on the **server** — authoritative for funnels.
- **Interaction events** (CTA click, plan button): tracked on the **client** — UX funnel steps.
- Never send passwords, API key values, or webhook secrets in event properties.

## Querying by signup source

In PostHog Insights:

1. Trend → Event `signup_completed` → Breakdown by `signup_source`
2. Funnel → `signup_completed` → `checkout_completed` → Breakdown by `signup_source`
3. Persons → Filter `signup_source = twitter_x` → View `plan_tier` distribution

SQL (if using PostHog warehouse) or Prisma:

```sql
SELECT signup_source, COUNT(*) AS signups,
       COUNT(*) FILTER (WHERE subscription_status IN ('active','trialing')) AS paid
FROM "User"
WHERE signup_source IS NOT NULL
GROUP BY signup_source;
```
