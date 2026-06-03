import Link from "next/link";
import { DesignSwissLogo } from "@/components/branding/DesignSwissLogo";
import { Card, ButtonLink, PageHeader, EmptyState } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { activeStatuses } from "@/lib/options";
import { customerName, formatDate } from "@/lib/format";
import type { Customer, Project } from "@/types/database";

type ProjectWithCustomer = Pick<Project, "id" | "project_name" | "project_type" | "project_status" | "created_at"> & {
  customers: Pick<Customer, "first_name" | "last_name" | "company_name"> | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const [{ count: customerCount }, { count: activeCount }, projectsResult] = await Promise.all([
    supabase.from("customers").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }).in("project_status", activeStatuses),
    supabase
      .from("projects")
      .select("id, project_name, project_type, project_status, created_at, customers(first_name,last_name,company_name)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);
  const projects = projectsResult.data as ProjectWithCustomer[] | null;

  return (
    <>
      <section className="mb-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-8 shadow-xl shadow-black/10 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">Field workspace</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white sm:text-4xl">
              DesignSwiss Field Intake System
            </h1>
          </div>
          <div className="flex justify-start md:justify-end">
            <DesignSwissLogo size="large" priority />
          </div>
        </div>
      </section>

      <PageHeader
        title="Dashboard"
        actions={
          <>
            <ButtonLink href="/customers/new">New Customer</ButtonLink>
            <ButtonLink href="/projects/new">New Project</ButtonLink>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-sm font-semibold text-[var(--muted)]">Total customers</p>
          <p className="mt-3 text-4xl font-semibold text-white">{customerCount ?? 0}</p>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-[var(--muted)]">Active projects</p>
          <p className="mt-3 text-4xl font-semibold text-white">{activeCount ?? 0}</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ButtonLink href="/customers/new">New Customer</ButtonLink>
        <ButtonLink href="/projects/new">New Project</ButtonLink>
        <ButtonLink href="/customers">View Customers</ButtonLink>
        <ButtonLink href="/projects">View Projects</ButtonLink>
      </div>

      <Card className="mt-8">
        <h2 className="text-xl font-semibold text-white">Recent projects</h2>
        <div className="mt-4 space-y-3">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="block rounded-md border border-[var(--border)] bg-[#10171e] p-4 transition hover:border-[var(--accent)]">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-white">{project.project_name || "Untitled project"}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{customerName(project.customers)} · {project.project_type || "No type"}</p>
                  </div>
                  <div className="text-sm text-slate-300">{project.project_status || "New"} · {formatDate(project.created_at)}</div>
                </div>
              </Link>
            ))
          ) : (
            <EmptyState title="No projects yet" body="Create a customer and project to start capturing field intake details." action={<ButtonLink href="/projects/new">New Project</ButtonLink>} />
          )}
        </div>
      </Card>
    </>
  );
}
