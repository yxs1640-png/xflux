import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-zinc-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />}
              {isLast || !item.href ? (
                <span className={isLast ? "text-zinc-300" : undefined} aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-white transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function SignalFaqSection({
  items,
}: {
  items: Array<{ question: string; answer: string }>;
}) {
  if (items.length === 0) return null;

  return (
    <section className="mt-12 border-t border-zinc-800 pt-10" aria-labelledby="signal-faq-heading">
      <h2 id="signal-faq-heading" className="text-xl font-bold text-white mb-6">
        Frequently asked questions
      </h2>
      <dl className="space-y-6">
        {items.map((item) => (
          <div key={item.question}>
            <dt className="text-sm font-medium text-zinc-200 mb-1">{item.question}</dt>
            <dd className="text-sm text-zinc-500 leading-relaxed">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
