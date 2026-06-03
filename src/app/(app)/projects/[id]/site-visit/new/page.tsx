import { notFound } from "next/navigation";
import { createSiteVisit } from "@/app/actions/projects";
import { Card, Checkbox, Field, Notice, PageHeader, Select, SubmitButton, TextArea } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";

export default async function NewSiteVisitPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const qs = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("project_name, project_type").eq("id", id).single();
  const project = data as { project_name: string | null; project_type: string | null } | null;

  if (!project) notFound();

  return (
    <>
      <PageHeader eyebrow="Field notes" title={`Site visit: ${project.project_name || "Untitled project"}`} />
      <Notice tone="error" message={qs.error} />
      <Card>
        <form action={createSiteVisit} className="space-y-6">
          <input type="hidden" name="project_id" value={id} />
          <Field label="Visit date" name="visit_date" type="date" />
          <TextArea label="Access notes" name="access_notes" rows={5} />
          <TextArea label="Existing conditions" name="existing_conditions" rows={7} />
          <TextArea label="Measurements" name="measurements" rows={8} />
          <TextArea label="Requirements" name="requirements" rows={8} />
          <TextArea label="Customer concerns" name="customer_concerns" rows={6} />
          <TextArea label="Follow-up items" name="follow_up_items" rows={6} />

          <section className="rounded-lg border border-[var(--border)] bg-black/10 p-5">
            <h2 className="text-xl font-semibold text-white">Smart Home / Automation</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <Select label="Existing ecosystem" name="existing_ecosystem" options={["HomeKit", "Alexa", "Google", "Home Assistant", "Mixed", "None"]} includeBlank />
              <Select label="Wi-Fi quality" name="wifi_quality" options={["Good", "Fair", "Poor", "Unknown"]} includeBlank />
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <TextArea label="Existing devices" name="existing_devices" rows={5} />
              <TextArea label="Automation goals" name="automation_goals" rows={5} />
            </div>
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-black/10 p-5">
            <h2 className="text-xl font-semibold text-white">Woodworking / Custom Build</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <TextArea label="Dimensions" name="dimensions" rows={5} />
              <Select label="Material preference" name="material_preference" options={["Pine", "Oak", "Walnut", "Maple", "Plywood", "MDF", "Other", "Unknown"]} includeBlank />
              <TextArea label="Finish preference" name="finish_preference" rows={5} />
              <TextArea label="Install location" name="install_location" rows={5} />
            </div>
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-black/10 p-5">
            <h2 className="text-xl font-semibold text-white">Website / Digital</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <Field label="Existing domain" name="existing_domain" />
              <Field label="Existing hosting" name="existing_hosting" />
              <TextArea label="Pages needed" name="pages_needed" rows={5} />
              <div className="space-y-3">
                <Checkbox label="Branding/assets available" name="branding_assets_available" />
                <Checkbox label="Contact form needed" name="contact_form_needed" />
                <Checkbox label="Blog needed" name="blog_needed" />
              </div>
            </div>
          </section>

          <SubmitButton>Save site visit</SubmitButton>
        </form>
      </Card>
    </>
  );
}
