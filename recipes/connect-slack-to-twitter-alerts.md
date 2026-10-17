# Connect Slack to Twitter alerts with an Incoming Webhook

This connects Twitter/X → Slack. It does not post from Slack to Twitter, and it is not the official X Account Activity API.

[XFlux](https://www.xfluxapi.com/connect-slack-to-twitter) watches a public @handle. On a new matching post it sends a Slack Incoming Webhook whose `text` looks like:

`*@author* posted:` then the tweet text, then the `https://x.com/...` link.

Free can send a test ping. Live hits start on Starter ($19/mo).

## 1. Create a Slack Incoming Webhook

Slack → Apps → Incoming Webhooks → Add to Slack → pick the channel → copy the URL (`https://hooks.slack.com/services/...`).

Treat that URL as a secret.

## 2. Create a monitor

1. Register (no card on Free): https://www.xfluxapi.com/register?src=github_slack
2. Dashboard → Monitors → add one public username
3. Optional keywords so you only alert on a ticker or phrase
4. Paste the Slack URL and click Test

Slack should show: `XFlux test OK — monitor @handle is connected.`

## 3. Live delivery

Free stores hits in the Dashboard and can send the test. Starter and above post into Slack when a new matching tweet is detected.

The same monitor accepts a Discord webhook or your own HTTPS URL. Swap the URL.

Site version: https://www.xfluxapi.com/blog/connect-slack-to-twitter-alerts
