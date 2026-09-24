"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { DOC_NAV_SECTIONS } from "@/lib/docs-nav";

export function DocsSidebar() {
  const pathname = usePathname();
  const t = useTranslations("docsNav");

  return (
    <aside className="w-full lg:w-56 shrink-0">
      <nav className="sticky top-24 space-y-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 px-3">
          {t("documentation")}
        </p>
        {DOC_NAV_SECTIONS.map((section) => (
          <div key={section.titleKey}>
            <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
              {t(section.titleKey)}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  item.href === "/docs"
                    ? pathname === "/docs"
                    : item.href === "/use-cases"
                      ? pathname === "/use-cases"
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-sky-500/10 text-sky-400 font-medium"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                    )}
                  >
                    {t(item.titleKey)}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
