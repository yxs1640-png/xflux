"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Radar } from "lucide-react";

/** Unread monitor hit badge on sidebar Monitors link — polls while dashboard is open. */
export function MonitorAlertsNavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof Radar;
  active: boolean;
}) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/monitor-alerts");
      if (!res.ok) return;
      const data = await res.json();
      setUnreadCount(data.unreadCount ?? 0);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, 45_000);
    return () => window.clearInterval(id);
  }, [refresh, pathname]);

  useEffect(() => {
    if (pathname.startsWith("/dashboard/monitors")) {
      fetch("/api/dashboard/monitor-alerts", { method: "POST" }).then(() => {
        setUnreadCount(0);
      });
    }
  }, [pathname]);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
        active
          ? "bg-sky-500/10 text-sky-400"
          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="flex-1">{label}</span>
      {unreadCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1.5 text-[10px] font-semibold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
