import { notFound } from "next/navigation";
import { uploadProjectPhoto } from "@/app/actions/projects";
import { Card, EmptyState, Field, Notice, PageHeader, Select, SubmitButton } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { photoCategories } from "@/lib/options";
import { PROJECT_PHOTOS_BUCKET } from "@/lib/storage";
import type { ProjectPhoto } from "@/types/database";

export default async function ProjectPhotosPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; uploaded?: string }>;
}) {
  const { id } = await params;
  const qs = await searchParams;
  const supabase = await createClient();
  const [projectResult, photosResult] = await Promise.all([
    supabase.from("projects").select("project_name").eq("id", id).single(),
    supabase.from("project_photos").select("*").eq("project_id", id).order("created_at", { ascending: false }),
  ]);
  const project = projectResult.data as { project_name: string | null } | null;
  const photos = photosResult.data as ProjectPhoto[] | null;

  if (!project) notFound();

  const photosWithUrls = await Promise.all(
    (photos ?? []).map(async (photo) => {
      const { data } = await supabase.storage.from(PROJECT_PHOTOS_BUCKET).createSignedUrl(photo.storage_path || "", 60 * 60);
      return { ...photo, url: data?.signedUrl || "" };
    }),
  );

  return (
    <>
      <PageHeader eyebrow="Photos" title={project.project_name || "Project photos"} />
      <Notice tone="error" message={qs.error} />
      <Notice message={qs.uploaded ? "Photo uploaded." : null} />
      <Card>
        <form action={uploadProjectPhoto} className="space-y-5">
          <input type="hidden" name="project_id" value={id} />
          <label className="block text-sm font-semibold text-slate-200">
            Photo
            <input className="mt-2 min-h-12 w-full rounded-md border border-[var(--border)] bg-[#10171e] px-4 py-3 text-base text-white file:mr-4 file:rounded-md file:border-0 file:bg-[var(--accent)] file:px-4 file:py-2 file:font-semibold file:text-[#06110f]" name="photo" type="file" accept="image/*" required />
          </label>
          <Select label="Category" name="category" options={photoCategories} includeBlank />
          <Field label="Caption" name="caption" />
          <SubmitButton>Upload photo</SubmitButton>
        </form>
      </Card>

      <div className="mt-6">
        {photosWithUrls.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photosWithUrls.map((photo) => (
              <Card key={photo.id} className="overflow-hidden p-0">
                <div className="relative aspect-[4/3] bg-black">
                  {photo.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo.url} alt={photo.caption || photo.category || "Project photo"} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="p-4">
                  <p className="font-semibold text-white">{photo.category || "Photo"}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{photo.caption || "No caption"}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState title="No photos yet" body="Upload photos from your iPad camera roll or field visit reference shots." />
        )}
      </div>
    </>
  );
}
