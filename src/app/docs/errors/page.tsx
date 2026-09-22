import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { Callout, CodeBlock, DocHeading } from "@/components/docs/doc-blocks";

export const metadata = pageMetadata({
  title: "API Errors",
  description:
    "XFlux API error codes: UNAUTHORIZED, QUOTA_EXCEEDED, RATE_LIMIT_EXCEEDED, USER_NOT_FOUND, NOT_FOUND, UPSTREAM_ERROR — with HTTP status and Retry-After.",
  path: "/docs/errors",
});

const ERRORS = [
  {
    code: "UNAUTHORIZED",
    status: "401",
    meaning: "Missing or invalid API key",
    action: "Check Bearer / X-API-Key and that the key is active",
  },
  {
    code: "QUOTA_EXCEEDED",
    status: "429",
    meaning: "Monthly API call quota used up",
    action: "Upgrade plan or wait until quota resets (Dashboard → Usage)",
  },
  {
    code: "RATE_LIMIT_EXCEEDED",
    status: "429",
    meaning: "Per-minute request cap hit",
    action: "Back off; respect Retry-After header (seconds)",
  },
  {
    code: "USER_NOT_FOUND",
    status: "404",
    meaning: "No public user for that @username",
    action: "Verify the handle; restricted accounts may fail",
  },
  {
    code: "NOT_FOUND",
    status: "404",
    meaning: "Tweet or monitor resource not found",
    action: "Check IDs; monitors must belong to your account",
  },
  {
    code: "UPSTREAM_ERROR",
    status: "502 / 504",
    meaning: "Upstream data source error or timeout",
    action: "Retry with backoff; contact support if persistent",
  },
] as const;

export default function ErrorsDocsPage() {
  return (
    <>
      <h1 className="text-4xl font-bold text-white mb-4">Errors</h1>
      <p className="text-zinc-400 mb-8 leading-relaxed">
        Failed requests return JSON with an <code className="text-zinc-300">error</code> message and
        usually a <code className="text-zinc-300">code</code> field.
      </p>

      <DocHeading id="shape">Error shape</DocHeading>
      <CodeBlock>{`{
  "error": "Invalid or missing API key",
  "code": "UNAUTHORIZED"
}`}</CodeBlock>

      <DocHeading id="codes">Codes</DocHeading>
      <div className="overflow-x-auto rounded-lg border border-zinc-800 mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-zinc-500">
              <th className="p-3">Code</th>
              <th className="p-3">HTTP</th>
              <th className="p-3">Meaning</th>
              <th className="p-3">What to do</th>
            </tr>
          </thead>
          <tbody className="text-zinc-300">
            {ERRORS.map((row) => (
              <tr key={row.code} className="border-b border-zinc-800/50 align-top">
                <td className="p-3 font-mono text-sky-300 whitespace-nowrap">{row.code}</td>
                <td className="p-3 whitespace-nowrap">{row.status}</td>
                <td className="p-3 text-zinc-400">{row.meaning}</td>
                <td className="p-3 text-zinc-400">{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout title="Rate limits">
        On <code className="text-zinc-300">RATE_LIMIT_EXCEEDED</code>, response headers include{" "}
        <code className="text-zinc-300">Retry-After</code> (seconds). Plan caps:{" "}
        <Link href="/docs/limits#rate-limits" className="text-sky-400 hover:underline">
          Plans &amp; Limits
        </Link>
        .
      </Callout>

      <DocHeading id="auth">Related</DocHeading>
      <ul className="list-disc list-inside space-y-2 text-zinc-400 text-sm">
        <li>
          <Link href="/docs/authentication" className="text-sky-400 hover:underline">
            Authentication
          </Link>
        </li>
        <li>
          <Link href="/docs/limits" className="text-sky-400 hover:underline">
            Plans &amp; Limits
          </Link>
        </li>
      </ul>
    </>
  );
}
