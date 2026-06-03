"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PROJECT_PHOTOS_BUCKET } from "@/lib/storage";

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) || "").trim();
  return value || null;
}

function numberValue(formData: FormData, key: string) {
  const value = Number(formData.get(key) || 0);
  return Number.isFinite(value) ? value : 0;
}

export async function createProject(formData: FormData) {
  const supabase = await createClient();
  const customerId = text(formData, "customer_id");

  if (!customerId) {
    redirect("/projects/new?error=Choose%20a%20customer%20before%20creating%20a%20project.");
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      customer_id: customerId,
      project_name: text(formData, "project_name"),
      project_type: text(formData, "project_type"),
      project_status: text(formData, "project_status") || "New",
      requested_work: text(formData, "requested_work"),
      budget_range: text(formData, "budget_range"),
      target_timeline: text(formData, "target_timeline"),
      site_address_same_as_customer: formData.get("site_address_same_as_customer") === "on",
      site_address_line1: text(formData, "site_address_line1"),
      site_address_line2: text(formData, "site_address_line2"),
      site_city: text(formData, "site_city"),
      site_state: text(formData, "site_state"),
      site_zip: text(formData, "site_zip"),
      internal_notes: text(formData, "internal_notes"),
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/projects/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/projects");
  redirect(`/projects/${data.id}?created=1`);
}

export async function createSiteVisit(formData: FormData) {
  const supabase = await createClient();
  const projectId = String(formData.get("project_id") || "");
  const extras = [
    ["Existing ecosystem", text(formData, "existing_ecosystem")],
    ["Wi-Fi quality", text(formData, "wifi_quality")],
    ["Existing devices", text(formData, "existing_devices")],
    ["Automation goals", text(formData, "automation_goals")],
    ["Dimensions", text(formData, "dimensions")],
    ["Material preference", text(formData, "material_preference")],
    ["Finish preference", text(formData, "finish_preference")],
    ["Install location", text(formData, "install_location")],
    ["Existing domain", text(formData, "existing_domain")],
    ["Existing hosting", text(formData, "existing_hosting")],
    ["Pages needed", text(formData, "pages_needed")],
    ["Branding/assets available", formData.get("branding_assets_available") === "on" ? "Yes" : null],
    ["Contact form needed", formData.get("contact_form_needed") === "on" ? "Yes" : null],
    ["Blog needed", formData.get("blog_needed") === "on" ? "Yes" : null],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  const requirements = [text(formData, "requirements"), extras].filter(Boolean).join("\n\nProject-specific notes:\n");

  const { error } = await supabase.from("site_visits").insert({
    project_id: projectId,
    visit_date: text(formData, "visit_date"),
    access_notes: text(formData, "access_notes"),
    existing_conditions: text(formData, "existing_conditions"),
    measurements: text(formData, "measurements"),
    requirements,
    customer_concerns: text(formData, "customer_concerns"),
    follow_up_items: text(formData, "follow_up_items"),
  });

  if (error) {
    redirect(`/projects/${projectId}/site-visit/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}?siteVisit=1`);
}

export async function createEstimateItem(formData: FormData) {
  const supabase = await createClient();
  const projectId = String(formData.get("project_id") || "");
  const quantity = numberValue(formData, "quantity");
  const unitCost = numberValue(formData, "unit_cost");
  const laborHours = numberValue(formData, "labor_hours");
  const laborRate = numberValue(formData, "labor_rate");
  const total = quantity * unitCost + laborHours * laborRate;

  const { error } = await supabase.from("estimate_items").insert({
    project_id: projectId,
    item_type: text(formData, "item_type"),
    description: text(formData, "description"),
    quantity,
    unit_cost: unitCost,
    labor_hours: laborHours,
    labor_rate: laborRate,
    total,
  });

  if (error) {
    redirect(`/projects/${projectId}/estimate/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}?estimate=1`);
}

export async function uploadProjectPhoto(formData: FormData) {
  const supabase = await createClient();
  const projectId = String(formData.get("project_id") || "");
  const file = formData.get("photo");

  if (!(file instanceof File) || file.size === 0) {
    redirect(`/projects/${projectId}/photos?error=Choose%20a%20photo%20to%20upload.`);
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const storagePath = `${projectId}/${Date.now()}-${safeName}`;
  const upload = await supabase.storage.from(PROJECT_PHOTOS_BUCKET).upload(storagePath, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (upload.error) {
    redirect(`/projects/${projectId}/photos?error=${encodeURIComponent(upload.error.message)}`);
  }

  const { error } = await supabase.from("project_photos").insert({
    project_id: projectId,
    storage_path: storagePath,
    caption: text(formData, "caption"),
    category: text(formData, "category"),
  });

  if (error) {
    redirect(`/projects/${projectId}/photos?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}/photos?uploaded=1`);
}
