"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) || "").trim();
  return value || null;
}

export async function createCustomer(formData: FormData) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .insert({
      first_name: text(formData, "first_name"),
      last_name: text(formData, "last_name"),
      company_name: text(formData, "company_name"),
      phone: text(formData, "phone"),
      email: text(formData, "email"),
      address_line1: text(formData, "address_line1"),
      address_line2: text(formData, "address_line2"),
      city: text(formData, "city"),
      state: text(formData, "state"),
      zip: text(formData, "zip"),
      notes: text(formData, "notes"),
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/customers/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/customers");
  redirect(`/customers/${data.id}?created=1`);
}
