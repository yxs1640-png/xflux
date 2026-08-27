import { SITE_NAME, SITE_URL } from "@/lib/seo";
import type { SignalFeed } from "@/lib/signals/types";
import type { SignalTopicConfig } from "@/lib/signals/topics";

function jsonLdScript(data: object) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function SignalsHubJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/signals#webpage`,
        url: `${SITE_URL}/signals`,
        name: "Live X/Twitter Signal Digests by Topic",
        description:
          "Real-time X/Twitter signal digests for AI, crypto, trading, and startups — who posted what, key themes, and account monitors.",
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Signals", item: `${SITE_URL}/signals` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What are XFlux signal digests?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Signal digests are live pages that poll public X/Twitter accounts and search, then summarize who posted what, dominant themes, and which accounts to monitor — refreshed every two minutes.",
            },
          },
          {
            "@type": "Question",
            name: "How do I get alerts when an account posts?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Create a free XFlux account, add an account monitor for any public @username, and receive hits in the Dashboard. Paid plans add signed HTTP webhooks for real-time delivery.",
            },
          },
          {
            "@type": "Question",
            name: "Which topics are covered?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We publish digests for AI & LLM, crypto & Bitcoin, trading & markets, and startups & founders — each tracking leading voices plus live search.",
            },
          },
        ],
      },
    ],
  };

  return jsonLdScript(data);
}

export function SignalTopicJsonLd({
  topic,
  feed,
}: {
  topic: SignalTopicConfig;
  feed: SignalFeed;
}) {
  const pageUrl = `${SITE_URL}/signals/${topic.slug}`;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: topic.pageTitle,
        description: topic.description,
        dateModified: feed.fetchedAt,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: {
          "@type": "Thing",
          name: `${topic.title} on X/Twitter`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Signals", item: `${SITE_URL}/signals` },
          { "@type": "ListItem", position: 3, name: topic.title, item: pageUrl },
        ],
      },
      {
        "@type": "ItemList",
        name: `${topic.title} — latest posts`,
        numberOfItems: Math.min(feed.items.length, 10),
        itemListElement: feed.items.slice(0, 10).map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: item.tweetUrl,
          name: `@${item.username}: ${item.text.slice(0, 80)}`,
        })),
      },
      ...(topic.faq.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: topic.faq.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            },
          ]
        : []),
    ],
  };

  return jsonLdScript(data);
}
