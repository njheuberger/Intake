import { notFound } from "next/navigation";
import { Card, PageHeader } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("project_name").eq("id", id).single();
  const project = data as { project_name: string | null } | null;

  if (!project) notFound();

  return (
    <>
      <PageHeader eyebrow="Later phase" title="Edit Project" />
      <Card>
        <p className="text-base leading-7 text-slate-300">
          Editing existing project records is intentionally left for the next pass. Phase 1 captures new intake data and keeps the record history simple.
        </p>
      </Card>
    </>
  );
}
