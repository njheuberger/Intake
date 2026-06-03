import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink, Card, EmptyState, Notice, PageHeader } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { address, customerName, formatDate } from "@/lib/format";
import type { Customer, Project } from "@/types/database";

export default async function CustomerDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const qs = await searchParams;
  const supabase = await createClient();
  const [customerResult, projectsResult] = await Promise.all([
    supabase.from("customers").select("*").eq("id", id).single(),
    supabase.from("projects").select("*").eq("customer_id", id).order("created_at", { ascending: false }),
  ]);
  const customer = customerResult.data as Customer | null;
  const projects = projectsResult.data as Project[] | null;

  if (!customer) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Customer"
        title={customerName(customer)}
        actions={<ButtonLink href={`/projects/new?customer_id=${customer.id}`}>New Project</ButtonLink>}
      />
      <Notice message={qs.created ? "Customer created." : null} />
      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <Card>
          <h2 className="text-xl font-semibold text-white">Contact details</h2>
          <dl className="mt-4 space-y-3 text-base">
            <div><dt className="text-[var(--muted)]">Email</dt><dd className="text-white">{customer.email || "Not set"}</dd></div>
            <div><dt className="text-[var(--muted)]">Phone</dt><dd className="text-white">{customer.phone || "Not set"}</dd></div>
            <div><dt className="text-[var(--muted)]">Address</dt><dd className="text-white">{address([customer.address_line1, customer.address_line2, customer.city, customer.state, customer.zip])}</dd></div>
            <div><dt className="text-[var(--muted)]">Notes</dt><dd className="whitespace-pre-wrap text-white">{customer.notes || "No notes"}</dd></div>
          </dl>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold text-white">Related projects</h2>
          <div className="mt-4 space-y-3">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`} className="block rounded-md border border-[var(--border)] bg-[#10171e] p-4 hover:border-[var(--accent)]">
                  <p className="font-semibold text-white">{project.project_name || "Untitled project"}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{project.project_type || "No type"} · {project.project_status || "New"} · {formatDate(project.created_at)}</p>
                </Link>
              ))
            ) : (
              <EmptyState title="No projects for this customer" body="Create a project when you are ready to scope work for this customer." action={<ButtonLink href={`/projects/new?customer_id=${customer.id}`}>New Project</ButtonLink>} />
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
