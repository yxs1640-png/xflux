---
# DO NOT PUBLISH. The xfluxapi Dev.to account is banned; public posts 404.
# Canonical copy lives in recipes/connect-slack-to-twitter-alerts.md
title: "Connect Slack to Twitter Alerts with an Incoming Webhook"
published: false
description: "Watch a public X/Twitter account and post new tweets into a Slack channel. Free test ping. Live delivery on a paid plan. This does not post to Twitter."
tags: slack, twitter, webhooks, tutorial
canonical_url: https://www.xfluxapi.com/blog/connect-slack-to-twitter-alerts
---

This connects **Twitter/X → Slack**. It does not post from Slack to Twitter, and it is not the official X Account Activity API.

[XFlux](https://www.xfluxapi.com/connect-slack-to-twitter) watches a public @handle. On a new matching post it sends a Slack Incoming Webhook whose `text` looks like:

`*@author* posted:` then the tweet text, then the `https://x.com/...` link.

Free can send a test ping. Live hits start on Starter ($19/mo).

## 1. Create a Slack Incoming Webhook

Slack → Apps → Incoming Webhooks → Add to Slack → pick the channel → copy the URL (`https://hooks.slack.com/services/...`).

Treat that URL as a secret.

## 2. Create a monitor

1. Register (no card on Free): [xfluxapi.com/register](https://www.xfluxapi.com/register?src=devto_slack)
2. Dashboard → Monitors → add one public username
3. Optional keywords so you only alert on a ticker or phrase
4. Paste the Slack URL and click Test

Slack should show: `XFlux test OK — monitor @handle is connected.`

## 3. Live delivery

Free stores hits in the Dashboard and can send the test. Starter and above post into Slack when a new matching tweet is detected.

The same monitor accepts a Discord webhook or your own HTTPS URL. Swap the URL.

Full write-up: [Connect Slack to Twitter alerts](https://www.xfluxapi.com/blog/connect-slack-to-twitter-alerts)
