"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Key,
  BarChart3,
  Radar,
  Settings,
  CreditCard,
  Zap,
  Sparkles,
  LogOut,
  BookOpen,
  Lightbulb,
  Radio,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { MonitorAlertsNavItem } from "@/components/dashboard/monitor-alerts-nav-item";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { href: "/dashboard/usage", label: "Usage", icon: BarChart3 },
  { href: "/dashboard/monitors", label: "Monitors", icon: Radar },
  { href: "/dashboard/signals", label: "My Signals", icon: Sparkles },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const RESOURCE_NAV = [
  { href: "/signals", label: "Signals", icon: Radio },
  { href: "/docs", label: "API Docs", icon: BookOpen },
  { href: "/use-cases", label: "Use Cases", icon: Lightbulb },
];

function isResourceNavActive(pathname: string, href: string): boolean {
  if (href === "/docs") return pathname === "/docs" || pathname.startsWith("/docs/");
  if (href === "/signals") return pathname === "/signals" || pathname.startsWith("/signals/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="flex h-16 items-center gap-2 border-b border-zinc-800 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-white">XFlux</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            if (item.href === "/dashboard/monitors") {
              return (
                <MonitorAlertsNavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={active}
                />
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-sky-500/10 text-sky-400"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-6 border-t border-zinc-800 pt-6">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Resources
          </p>
          <div className="space-y-1">
            {RESOURCE_NAV.map((item) => {
              const active = isResourceNavActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-sky-500/10 text-sky-400"
                      : "text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="border-t border-zinc-800 p-4">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
