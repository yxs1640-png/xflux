Add under **APIs, Data and ML** in `README.md`, alphabetically after **What The Diff**:

```markdown
  * [XFlux](https://www.xfluxapi.com) - X/Twitter read REST API (profiles, search, timelines) plus account monitors. Free tier: 1,000 API calls/month, 1 monitor, instant API key. HTTP webhooks on paid plans from $19/mo.
```

Or run: `bash scripts/submit-free-for-dev.sh` (after forking on GitHub).

## PR steps

1. Fork https://github.com/ripienaar/free-for-dev
2. Branch: `add-xflux`
3. Find the best section (search for "Twitter" or "API" in README.md)
4. Add the entry above in alphabetical order within that section
5. Open PR with title: `Add XFlux — X/Twitter API with free tier`

## PR body template

```
## Requirements

 * [x] This is Software as a Service not self hosted
 * [x] It has a free tier not just a free trial
 * [x] Pricing information is clearly visible without signup or phone calls
 * [x] The submission mentions what is free
 * [x] The submission is not already present in the list
 * [x] The service has contact details of those running it and a privacy policy

## Summary

Adds XFlux — freemium X/Twitter read API with account monitors.

- Website: https://www.xfluxapi.com
- Free tier: 1,000 API calls/month, 1 monitor, no credit card
- Paid from $19/mo (webhooks, higher quotas)
```
