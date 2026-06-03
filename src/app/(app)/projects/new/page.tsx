import { createProject } from "@/app/actions/projects";
import { Card, Checkbox, Field, Notice, PageHeader, Select, SubmitButton, TextArea } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { budgetRanges, projectStatuses, projectTypes } from "@/lib/options";
import { customerName } from "@/lib/format";
import type { Customer } from "@/types/database";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ customer_id?: string; error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
  const customers = data as Customer[] | null;

  return (
    <>
      <PageHeader eyebrow="New work" title="Create project" />
      <Notice tone="error" message={params.error} />
      <Card>
        <form action={createProject} className="space-y-5">
          <label className="block text-sm font-semibold text-slate-200">
            Customer
            <select className="mt-2 min-h-12 w-full rounded-md border border-[var(--border)] bg-[#10171e] px-4 py-3 text-base text-white outline-none focus:border-[var(--accent)]" name="customer_id" defaultValue={params.customer_id || ""} required>
              <option value="">Select customer...</option>
              {customers?.map((customer) => (
                <option key={customer.id} value={customer.id}>{customerName(customer)}</option>
              ))}
            </select>
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Project name" name="project_name" required />
            <Select label="Project type" name="project_type" options={projectTypes} includeBlank required />
            <Select label="Project status" name="project_status" options={projectStatuses} defaultValue="New" required />
            <Select label="Budget range" name="budget_range" options={budgetRanges} includeBlank />
            <Field label="Target timeline" name="target_timeline" />
          </div>
          <TextArea label="Requested work" name="requested_work" rows={7} required />
          <Checkbox label="Site address is the same as customer address" name="site_address_same_as_customer" defaultChecked />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Site address line 1" name="site_address_line1" />
            <Field label="Site address line 2" name="site_address_line2" />
            <Field label="Site city" name="site_city" />
            <Field label="Site state" name="site_state" />
            <Field label="Site zip" name="site_zip" />
          </div>
          <TextArea label="Internal notes" name="internal_notes" rows={6} />
          <SubmitButton>Create project</SubmitButton>
        </form>
      </Card>
    </>
  );
}
