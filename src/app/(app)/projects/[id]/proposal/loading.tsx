import { PageHeader } from "@/components/ui";

export default function ProposalLoading() {
  return (
    <>
      <PageHeader eyebrow="Proposal Preview" title="Loading proposal..." />
      <div className="mx-auto max-w-5xl space-y-5 rounded-lg bg-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="h-40 animate-pulse rounded-lg bg-slate-300" />
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="h-48 animate-pulse rounded-lg bg-slate-300" />
          <div className="h-48 animate-pulse rounded-lg bg-slate-300" />
        </div>
        <div className="h-64 animate-pulse rounded-lg bg-slate-300" />
      </div>
    </>
  );
}
