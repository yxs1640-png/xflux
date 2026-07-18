import { LEGAL } from "@/lib/legal-config";

export function BillingComingSoonBanner() {
  return (
    <div className="mb-6 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200/90">
      <p className="font-medium text-amber-100">Paid plans are coming soon</p>
      <p className="mt-1 text-amber-200/80">
        The Free tier is fully available. Self-serve upgrades will open after Stripe Live
        billing is enabled. Need higher limits now? Email{" "}
        <a href={`mailto:${LEGAL.supportEmail}`} className="text-amber-100 underline">
          {LEGAL.supportEmail}
        </a>
        .
      </p>
    </div>
  );
}
