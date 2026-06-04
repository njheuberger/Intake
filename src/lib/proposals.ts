import { createClient } from "@/lib/supabase/server";
import { PROJECT_PHOTOS_BUCKET } from "@/lib/storage";
import type { Customer, EstimateItem, Project, ProjectPhoto, SiteVisit } from "@/types/database";

export type ProposalProject = Project & { customers: Customer | null };
export type ProposalPhoto = ProjectPhoto & { url: string };

export type ProposalData = {
  project: ProposalProject;
  latestVisit: SiteVisit | null;
  estimateItems: EstimateItem[];
  photos: ProposalPhoto[];
};

export class ProposalProjectNotFoundError extends Error {
  constructor(projectId: string) {
    super(`Project not found: ${projectId}`);
    this.name = "ProposalProjectNotFoundError";
  }
}

export async function getProposalData(projectId: string): Promise<ProposalData> {
  const supabase = await createClient();

  const [projectResult, visitResult, estimateResult, photoResult] = await Promise.all([
    supabase.from("projects").select("*, customers(*)").eq("id", projectId).single(),
    supabase.from("site_visits").select("*").eq("project_id", projectId).order("created_at", { ascending: false }).limit(1),
    supabase.from("estimate_items").select("*").eq("project_id", projectId).order("created_at", { ascending: true }),
    supabase.from("project_photos").select("*").eq("project_id", projectId).order("created_at", { ascending: false }).limit(4),
  ]);

  const project = projectResult.data as ProposalProject | null;
  if (!project) throw new ProposalProjectNotFoundError(projectId);

  const photos = await Promise.all(
    ((photoResult.data as ProjectPhoto[] | null) ?? []).map(async (photo) => {
      if (!photo.storage_path) return { ...photo, url: "" };
      const { data } = await supabase.storage.from(PROJECT_PHOTOS_BUCKET).createSignedUrl(photo.storage_path, 60 * 60);
      return { ...photo, url: data?.signedUrl ?? "" };
    }),
  );

  return {
    project,
    latestVisit: ((visitResult.data as SiteVisit[] | null) ?? [])[0] ?? null,
    estimateItems: (estimateResult.data as EstimateItem[] | null) ?? [],
    photos,
  };
}
