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
    <div className="safe-screen bg-[#050505] text-[var(--text)]">
      <SidebarNav userEmail={userEmail} />
      <div className="safe-screen flex flex-col lg:ml-[260px]">
        <MobileNav userEmail={userEmail} />
        <main className="safe-bottom safe-x w-full flex-1 overflow-x-hidden py-6 lg:h-screen lg:overflow-y-auto lg:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
