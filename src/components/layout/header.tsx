"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">XFlux</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/docs" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Docs
          </Link>
          <Link href="/pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Pricing
          </Link>
          {session && (
            <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="hidden text-sm text-zinc-400 sm:inline">
                {session.user.email}
              </span>
              <Link href="/dashboard/billing">
                <Button variant="outline" size="sm">
                  Upgrade
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/register?src=header">
                <Button size="sm">Get API Key</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
