import type { Customer } from "@/types/database";

export function customerName(customer?: Pick<Customer, "first_name" | "last_name" | "company_name"> | null) {
  if (!customer) return "Unknown customer";
  const person = [customer.first_name, customer.last_name].filter(Boolean).join(" ").trim();
  return customer.company_name || person || "Unnamed customer";
}

export function formatDate(value?: string | null) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(value),
  );
}

export function currency(value?: number | null) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value ?? 0);
}

export function address(parts: Array<string | null | undefined>) {
  return parts.filter(Boolean).join(", ") || "No address saved";
}
