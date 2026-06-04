import { signIn } from "@/app/actions/auth";
import { DesignSwissLogo } from "@/components/branding/DesignSwissLogo";
import { Notice } from "@/components/ui";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="safe-screen safe-x safe-top safe-bottom flex items-center justify-center py-10">
      <div className="flex w-full max-w-md flex-col items-center">
        <div className="mb-8 flex w-full justify-center">
          <DesignSwissLogo size="large" priority />
        </div>
        <section className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl shadow-black/20">
          <h1 className="mt-2 text-3xl font-semibold text-white">Field Intake Login</h1>
          <p className="mt-3 text-base leading-7 text-[var(--muted)]">Sign in before opening customer or project details.</p>
          <div className="mt-6">
            <Notice tone="error" message={params.error} />
          </div>
          <form action={signIn} className="mt-6 space-y-5">
            <input type="hidden" name="next" value={params.next || "/dashboard"} />
            <label className="block text-sm font-semibold text-slate-200">
              Email
              <input className="mt-2 min-h-12 w-full rounded-md border border-[var(--border)] bg-[#10171e] px-4 py-3 text-base text-white outline-none focus:border-[var(--accent)]" name="email" type="email" required />
            </label>
            <label className="block text-sm font-semibold text-slate-200">
              Password
              <input className="mt-2 min-h-12 w-full rounded-md border border-[var(--border)] bg-[#10171e] px-4 py-3 text-base text-white outline-none focus:border-[var(--accent)]" name="password" type="password" required />
            </label>
            <button className="min-h-12 w-full rounded-md bg-[var(--accent)] px-5 py-3 text-base font-semibold text-[#06110f] transition hover:bg-[var(--accent-strong)]">
              Sign in
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
