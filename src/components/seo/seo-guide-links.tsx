import Link from "next/link";

/** Shared internal links for SEO — homepage, pricing, signals. */
export const SEO_GUIDE_LINKS = [
  {
    href: "/docs/compare/pricing",
    label: "XFlux vs official X API pricing",
  },
  {
    href: "/use-cases/trading-alerts",
    label: "Trading & macro alerts",
  },
  {
    href: "/use-cases/ai-research",
    label: "AI research from X",
  },
  {
    href: "/use-cases/crypto-alerts",
    label: "Crypto & memecoin alerts",
  },
] as const;

export function SeoGuideLinks({
  className = "",
  heading = "Explore guides",
}: {
  className?: string;
  heading?: string;
}) {
  return (
    <nav aria-label={heading} className={className}>
      <p className="text-sm font-medium text-zinc-400 mb-3">{heading}</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {SEO_GUIDE_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
