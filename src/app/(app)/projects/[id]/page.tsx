import { notFound } from "next/navigation";
import { ButtonLink, Card, EmptyState, Notice, PageHeader, SecondaryLink } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { address, currency, customerName, formatDate } from "@/lib/format";
import type { Customer, EstimateItem, Project, ProjectPhoto, SiteVisit } from "@/types/database";

type ProjectWithCustomer = Project & { customers: Customer | null };

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; siteVisit?: string; estimate?: string }>;
}) {
  const { id } = await params;
  const qs = await searchParams;
  const supabase = await createClient();
  const [projectResult, visitsResult, estimatesResult, photosResult] = await Promise.all([
    supabase.from("projects").select("*, customers(*)").eq("id", id).single(),
    supabase.from("site_visits").select("*").eq("project_id", id).order("created_at", { ascending: false }),
    supabase.from("estimate_items").select("*").eq("project_id", id).order("created_at", { ascending: false }),
    supabase.from("project_photos").select("*").eq("project_id", id).order("created_at", { ascending: false }).limit(6),
  ]);
  const project = projectResult.data as ProjectWithCustomer | null;
  const visits = visitsResult.data as SiteVisit[] | null;
  const estimates = estimatesResult.data as EstimateItem[] | null;
  const photos = photosResult.data as ProjectPhoto[] | null;

  if (!project) notFound();

  const estimateTotal = estimates?.reduce((sum, item) => sum + (item.total ?? 0), 0) ?? 0;
  const siteAddress = project.site_address_same_as_customer
    ? address([
        project.customers?.address_line1,
        project.customers?.address_line2,
        project.customers?.city,
        project.customers?.state,
        project.customers?.zip,
      ])
    : address([project.site_address_line1, project.site_address_line2, project.site_city, project.site_state, project.site_zip]);

  return (
    <>
      <PageHeader
        eyebrow="Project"
        title={project.project_name || "Untitled project"}
        actions={
          <>
            <ButtonLink href={`/projects/${id}/site-visit/new`}>Add Site Visit</ButtonLink>
            <ButtonLink href={`/projects/${id}/estimate/new`}>Add Estimate Item</ButtonLink>
            <ButtonLink href={`/projects/${id}/photos`}>Upload Photo</ButtonLink>
            <ButtonLink href={`/projects/${id}/proposal`}>Generate Proposal</ButtonLink>
            <SecondaryLink href={`/projects/${id}/edit`}>Edit Project</SecondaryLink>
          </>
        }
      />
      <Notice message={qs.created ? "Project created." : qs.siteVisit ? "Site visit saved." : qs.estimate ? "Estimate item saved." : null} />

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h2 className="text-xl font-semibold text-white">Project info</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><dt className="text-sm text-[var(--muted)]">Customer</dt><dd className="text-white">{customerName(project.customers)}</dd></div>
            <div><dt className="text-sm text-[var(--muted)]">Status</dt><dd className="text-white">{project.project_status || "New"}</dd></div>
            <div><dt className="text-sm text-[var(--muted)]">Type</dt><dd className="text-white">{project.project_type || "No type"}</dd></div>
            <div><dt className="text-sm text-[var(--muted)]">Budget</dt><dd className="text-white">{project.budget_range || "Not set"}</dd></div>
            <div><dt className="text-sm text-[var(--muted)]">Timeline</dt><dd className="text-white">{project.target_timeline || "Not set"}</dd></div>
            <div><dt className="text-sm text-[var(--muted)]">Site address</dt><dd className="text-white">{siteAddress}</dd></div>
          </dl>
          <div className="mt-5 space-y-4">
            <div><h3 className="font-semibold text-white">Requested work</h3><p className="mt-2 whitespace-pre-wrap text-slate-300">{project.requested_work || "No requested work saved."}</p></div>
            <div><h3 className="font-semibold text-white">Internal notes</h3><p className="mt-2 whitespace-pre-wrap text-slate-300">{project.internal_notes || "No internal notes."}</p></div>
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold text-white">Estimate summary</h2>
          <p className="mt-4 text-4xl font-semibold text-white">{currency(estimateTotal)}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{estimates?.length ?? 0} line items</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-white">Site visits</h2>
          <div className="mt-4 space-y-3">
            {visits && visits.length > 0 ? visits.map((visit) => (
              <div key={visit.id} className="rounded-md border border-[var(--border)] bg-[#10171e] p-4">
                <p className="font-semibold text-white">{formatDate(visit.visit_date)}</p>
                <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-sm text-slate-300">{visit.follow_up_items || visit.requirements || "No notes"}</p>
              </div>
            )) : <EmptyState title="No site visits" body="Capture field notes, measurements, and requirements while with the customer." />}
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold text-white">Estimate items</h2>
          <div className="mt-4 space-y-3">
            {estimates && estimates.length > 0 ? estimates.map((item) => (
              <div key={item.id} className="rounded-md border border-[var(--border)] bg-[#10171e] p-4">
                <p className="font-semibold text-white">{item.item_type || "Item"} · {currency(item.total)}</p>
                <p className="mt-2 text-sm text-slate-300">{item.description || "No description"}</p>
              </div>
            )) : <EmptyState title="No estimate items" body="Add simple line items for labor, materials, hardware, software, travel, or other costs." />}
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold text-white">Photos</h2>
          <div className="mt-4 space-y-3">
            {photos && photos.length > 0 ? photos.map((photo) => (
              <div key={photo.id} className="rounded-md border border-[var(--border)] bg-[#10171e] p-4">
                <p className="font-semibold text-white">{photo.category || "Photo"}</p>
                <p className="mt-2 text-sm text-slate-300">{photo.caption || photo.storage_path}</p>
              </div>
            )) : <EmptyState title="No photos" body="Upload field photos, reference images, or finished work shots." />}
          </div>
        </Card>
      </div>
    </>
  );
}
