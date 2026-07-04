"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DOC_NAV } from "@/lib/docs-nav";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-56 shrink-0">
      <nav className="sticky top-24 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3 px-3">
          Documentation
        </p>
        {DOC_NAV.map((item) => {
          const active =
            item.href === "/docs"
              ? pathname === "/docs"
              : pathname.startsWith(item.href);

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
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
