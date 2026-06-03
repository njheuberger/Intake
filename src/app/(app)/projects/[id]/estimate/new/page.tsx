import { notFound } from "next/navigation";
import { createEstimateItem } from "@/app/actions/projects";
import { Card, Field, Notice, PageHeader, Select, SubmitButton, TextArea } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { estimateItemTypes } from "@/lib/options";

export default async function NewEstimateItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const qs = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("project_name").eq("id", id).single();
  const project = data as { project_name: string | null } | null;

  if (!project) notFound();

  return (
    <>
      <PageHeader eyebrow="Estimate" title={`Add line item: ${project.project_name || "Untitled project"}`} />
      <Notice tone="error" message={qs.error} />
      <Card>
        <form action={createEstimateItem} className="space-y-5">
          <input type="hidden" name="project_id" value={id} />
          <Select label="Item type" name="item_type" options={estimateItemTypes} includeBlank required />
          <TextArea label="Description" name="description" rows={5} required />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Quantity" name="quantity" type="number" defaultValue={1} />
            <Field label="Unit cost" name="unit_cost" type="number" defaultValue={0} />
            <Field label="Labor hours" name="labor_hours" type="number" defaultValue={0} />
            <Field label="Labor rate" name="labor_rate" type="number" defaultValue={0} />
          </div>
          <p className="rounded-md border border-[var(--border)] bg-black/10 px-4 py-3 text-sm text-[var(--muted)]">
            Total is calculated on save as quantity times unit cost plus labor hours times labor rate.
          </p>
          <SubmitButton>Save line item</SubmitButton>
        </form>
      </Card>
    </>
  );
}
