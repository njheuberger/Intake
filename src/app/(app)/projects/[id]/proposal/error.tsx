"use client";

import Link from "next/link";

export default function ProposalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--danger)]">Proposal Preview</p>
      <h1 className="mt-2 text-2xl font-semibold text-white">Could not load proposal</h1>
      <p className="mt-3 text-base leading-7 text-slate-300">
        {error.message || "Something went wrong while preparing this proposal preview."}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-12 items-center justify-center rounded-md bg-[var(--accent)] px-5 py-3 text-base font-semibold text-[#06110f]"
        >
          Try again
        </button>
        <Link
          href="/projects"
          className="inline-flex min-h-12 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-5 py-3 text-base font-semibold text-white"
        >
          Back to Projects
        </Link>
      </div>
    </div>
  );
}
