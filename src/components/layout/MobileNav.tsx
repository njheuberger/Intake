"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/app/actions/auth";
import { DesignSwissLogo } from "@/components/branding/DesignSwissLogo";
import { navItems } from "@/components/layout/nav-items";

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  if (href === "/customers/new" || href === "/projects/new") return pathname === href;
  if (href === "/customers") return pathname === href || (pathname.startsWith("/customers/") && pathname !== "/customers/new");
  if (href === "/projects") return pathname === href || (pathname.startsWith("/projects/") && pathname !== "/projects/new");
  return pathname === href;
}

export function MobileNav({ userEmail }: { userEmail?: string | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[#0c1116]/95 backdrop-blur lg:hidden">
        <div className="flex min-h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-white/40" aria-label="Go to dashboard">
            <DesignSwissLogo size="small" priority />
          </Link>
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={() => setOpen(true)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-white/12 bg-[#141a20] text-white transition hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
              <span className="h-0.5 rounded-full bg-current" />
              <span className="h-0.5 rounded-full bg-current" />
              <span className="h-0.5 rounded-full bg-current" />
            </span>
          </button>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button className="absolute inset-0 bg-black/60" aria-label="Close navigation menu" type="button" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-full max-w-[340px] flex-col border-l border-[var(--border)] bg-[#0c1116] shadow-2xl shadow-black/40">
            <div className="flex min-h-20 items-center justify-between border-b border-[var(--border)] px-5">
              <Link href="/dashboard" onClick={() => setOpen(false)} className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-white/40" aria-label="Go to dashboard">
                <DesignSwissLogo size="small" />
              </Link>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/12 bg-[#141a20] text-2xl leading-none text-white transition hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                ×
              </button>
            </div>

            <nav className="flex-1 px-4 py-5" aria-label="Mobile navigation">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-md border px-4 py-4 text-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/40 ${
                        active
                          ? "border-white/20 bg-white/12 text-white"
                          : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/7 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="border-t border-[var(--border)] p-4">
              {userEmail ? <p className="mb-3 truncate text-sm font-medium text-[var(--muted)]">{userEmail}</p> : null}
              <form action={signOut}>
                <button className="min-h-12 w-full rounded-md border border-white/12 bg-[#141a20] px-4 py-3 text-left text-base font-semibold text-slate-200 transition hover:border-red-400/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40">
                  Log out
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
