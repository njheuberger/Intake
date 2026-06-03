"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export function SidebarNav({ userEmail }: { userEmail?: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-[260px] shrink-0 border-r border-[var(--border)] bg-[#0c1116]/95 lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:flex-col">
      <div className="border-b border-[var(--border)] px-6 py-6">
        <Link href="/dashboard" className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-white/40" aria-label="Go to dashboard">
          <DesignSwissLogo size="small" priority />
        </Link>
      </div>

      <nav className="flex-1 px-4 py-5" aria-label="Main navigation">
        <div className="space-y-2">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-md border px-4 py-3 text-base font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/40 ${
                  active
                    ? "border-white/20 bg-white/12 text-white shadow-inner shadow-white/5"
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
        {userEmail ? <p className="mb-3 truncate text-xs font-medium text-[var(--muted)]">{userEmail}</p> : null}
        <form action={signOut}>
          <button className="min-h-11 w-full rounded-md border border-white/12 bg-[#141a20] px-4 py-2 text-left text-sm font-semibold text-slate-200 transition hover:border-red-400/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40">
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
