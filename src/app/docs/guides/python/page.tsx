import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { Callout, CodeBlock, DocHeading } from "@/components/docs/doc-blocks";
import { DOC_BASE_URL } from "@/lib/docs-nav";

export const metadata = pageMetadata({
  title: "Python Guide — XFlux X/Twitter API",
  description:
    "Call the XFlux read API from Python with requests: profiles, timelines, search, and Bearer auth against www.xfluxapi.com/api/v1.",
  path: "/docs/guides/python",
  keywords: [
    "twitter api python",
    "x api python example",
    "xflux python",
    "twitter search python",
  ],
});

export default async function PythonGuidePage() {
  const t = await getTranslations("docsPython");

  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-4">{t("title")}</h1>
      <p className="text-zinc-400 mb-8 leading-relaxed">
        {t("introBefore")} <code className="text-zinc-300">requests</code>
        {t("introAfter")} <code className="text-zinc-300">{DOC_BASE_URL}</code>.
      </p>

      <DocHeading id="setup">{t("setup")}</DocHeading>
      <ol className="list-decimal list-inside space-y-2 text-zinc-400 text-sm leading-relaxed mb-4">
        <li>
          <Link href="/register" className="text-sky-400 hover:underline">
            {t("register")}
          </Link>{" "}
          {t("setup1After")} <code className="text-zinc-300">xflux_</code> key
        </li>
        <li>
          <code className="text-zinc-300">{t("setup2")}</code>
        </li>
        <li>
          {t("setup3")} <code className="text-zinc-300">XFLUX_API_KEY</code> {t("setup3After")}
        </li>
      </ol>
      <CodeBlock>{`export XFLUX_API_KEY=xflux_YOUR_KEY`}</CodeBlock>

      <DocHeading id="auth">{t("auth")}</DocHeading>
      <CodeBlock>{`import os
import requests

BASE = "${DOC_BASE_URL}"
headers = {"Authorization": f"Bearer {os.environ['XFLUX_API_KEY']}"}
# or: headers = {"X-API-Key": os.environ["XFLUX_API_KEY"]}`}</CodeBlock>

      <DocHeading id="profile">{t("profile")}</DocHeading>
      <CodeBlock>{`r = requests.get(f"{BASE}/users/elonmusk", headers=headers, timeout=30)
r.raise_for_status()
user = r.json()["data"]
print(user["username"], user.get("followers_count"))`}</CodeBlock>

      <DocHeading id="timeline">{t("timeline")}</DocHeading>
      <CodeBlock>{`r = requests.get(
    f"{BASE}/users/OpenAI/tweets",
    headers=headers,
    params={"limit": 10},
    timeout=30,
)
r.raise_for_status()
for tweet in r.json()["data"]:
    print(tweet["id"], (tweet.get("text") or "")[:100])`}</CodeBlock>

      <DocHeading id="search">{t("search")}</DocHeading>
      <p className="text-zinc-400 text-sm mb-4">
        {t("searchBlurbBefore")} <code className="text-zinc-300">from:</code> and{" "}
        <code className="text-zinc-300">lang:</code> {t("searchBlurbAfter")}{" "}
        <Link href="/docs/guides/search" className="text-sky-400 hover:underline">
          {t("searchLink")}
        </Link>
        .
      </p>
      <CodeBlock>{`r = requests.get(
    f"{BASE}/search",
    headers=headers,
    params={"q": "fed rate", "limit": 20},
    timeout=30,
)
r.raise_for_status()
print(len(r.json()["data"]), "hits")`}</CodeBlock>

      <DocHeading id="tweet">{t("tweet")}</DocHeading>
      <CodeBlock>{`tweet_id = "1234567890"
r = requests.get(f"{BASE}/tweets/{tweet_id}", headers=headers, timeout=30)
r.raise_for_status()
print(r.json()["data"])`}</CodeBlock>

      <Callout title={t("calloutTitle")}>{t("callout")}</Callout>

      <DocHeading id="errors">{t("errors")}</DocHeading>
      <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{t("errorsBlurb")}</p>

      <DocHeading id="related">{t("related")}</DocHeading>
      <ul className="list-disc list-inside space-y-2 text-zinc-400 text-sm">
        <li>
          <Link href="/docs/guides/nodejs" className="text-sky-400 hover:underline">
            {t("nodeGuide")}
          </Link>
        </li>
        <li>
          <Link href="/docs/api" className="text-sky-400 hover:underline">
            {t("apiRef")}
          </Link>
        </li>
        <li>
          <Link href="/blog/twitter-api-python-nodejs" className="text-sky-400 hover:underline">
            {t("blogLink")}
          </Link>
        </li>
      </ul>
    </>
  );
}
