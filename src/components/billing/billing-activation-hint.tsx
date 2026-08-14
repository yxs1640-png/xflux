import Link from "next/link";

type BillingActivationHintProps = {
  quotaUsed: number;
};

export function BillingActivationHint({ quotaUsed }: BillingActivationHintProps) {
  if (quotaUsed > 0) return null;

  return (
    <div className="mb-6 rounded-lg border border-zinc-700 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-300">
      <p className="font-medium text-white">Try the API before upgrading</p>
      <p className="mt-1 text-zinc-400">
        Run a free test call from the dashboard checklist, then compare plans when you know your usage.
      </p>
      <Link href="/dashboard" className="mt-2 inline-block text-sky-400 hover:text-sky-300">
        Go to Getting started →
      </Link>
    </div>
  );
}
