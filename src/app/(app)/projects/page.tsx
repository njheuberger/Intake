import Link from "next/link";
import { ButtonLink, Card, EmptyState, PageHeader, Select } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { projectStatuses, projectTypes } from "@/lib/options";
import { customerName, formatDate } from "@/lib/format";
import type { Customer, Project } from "@/types/database";

type ProjectWithCustomer = Pick<Project, "id" | "project_name" | "project_type" | "project_status" | "created_at"> & {
  customers: Pick<Customer, "first_name" | "last_name" | "company_name"> | null;
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>;
}) {
  const filters = await searchParams;
  const supabase = await createClient();
  let request = supabase
    .from("projects")
    .select("id, project_name, project_type, project_status, created_at, customers(first_name,last_name,company_name)")
    .order("created_at", { ascending: false });

  if (filters.status) request = request.eq("project_status", filters.status);
  if (filters.type) request = request.eq("project_type", filters.type);

  const { data } = await request;
  const projects = data as ProjectWithCustomer[] | null;

  return (
    <>
      <PageHeader eyebrow="Work" title="Projects" actions={<ButtonLink href="/projects/new">New Project</ButtonLink>} />
      <form className="mb-5 grid gap-4 sm:grid-cols-3">
        <Select label="Status" name="status" options={projectStatuses} defaultValue={filters.status} includeBlank />
        <Select label="Project type" name="type" options={projectTypes} defaultValue={filters.type} includeBlank />
        <button className="mt-7 min-h-12 rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-5 text-base font-semibold text-white hover:border-[var(--accent)]">
          Apply filters
        </button>
      </form>
      {projects && projects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="h-full transition hover:border-[var(--accent)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{project.project_name || "Untitled project"}</h2>
                    <p className="mt-2 text-sm text-[var(--muted)]">{customerName(project.customers)} · {formatDate(project.created_at)}</p>
                  </div>
                  <span className="rounded-md border border-[var(--border)] px-3 py-1 text-sm text-slate-200">{project.project_status || "New"}</span>
                </div>
                <p className="mt-5 text-base text-slate-300">{project.project_type || "No project type"}</p>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="No projects found" body="Start a project intake from an existing customer or create a new customer first." action={<ButtonLink href="/projects/new">New Project</ButtonLink>} />
      )}
    </>
  );
}
