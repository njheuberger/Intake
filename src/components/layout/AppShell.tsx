import { createClient } from "@/lib/supabase/server";
import { MobileNav } from "@/components/layout/MobileNav";
import { SidebarNav } from "@/components/layout/SidebarNav";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userEmail = user?.email ?? null;

  return (
    <div className="min-h-screen bg-[#0d1116] text-[var(--text)]">
      <SidebarNav userEmail={userEmail} />
      <div className="flex min-h-screen flex-col lg:ml-[260px]">
        <MobileNav userEmail={userEmail} />
        <main className="w-full flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:h-screen lg:overflow-y-auto lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
