import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white">XFlux</span>
            </div>
            <p className="text-sm text-zinc-500">
              X/Twitter read API and account monitors for developers. Paid plans include signed HTTP
              webhooks.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Product</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/docs" className="hover:text-white transition-colors">API Docs</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/feedback" className="hover:text-white transition-colors">Feedback</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Features</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>User & tweet lookup</li>
              <li>Search API</li>
              <li>Account monitors</li>
              <li>HTTP webhooks (paid)</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link href="/acceptable-use" className="hover:text-white transition-colors">Acceptable Use</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-800 pt-8 text-center text-sm text-zinc-600">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> XFlux. Not affiliated with X Corp.
        </div>
      </div>
    </footer>
  );
}
