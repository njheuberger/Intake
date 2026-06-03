import Link from "next/link";
import { ButtonLink, Card, EmptyState, PageHeader, fieldClass } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { address, customerName } from "@/lib/format";
import type { Customer } from "@/types/database";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();
  const query = q?.trim();
  let request = supabase.from("customers").select("*").order("created_at", { ascending: false });

  if (query) {
    request = request.or(
      `first_name.ilike.%${query}%,last_name.ilike.%${query}%,company_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`,
    );
  }

  const { data } = await request;
  const customers = data as Customer[] | null;

  return (
    <>
      <PageHeader eyebrow="Contacts" title="Customers" actions={<ButtonLink href="/customers/new">New Customer</ButtonLink>} />
      <form className="mb-5">
        <input className={fieldClass} name="q" defaultValue={query || ""} placeholder="Search by name, company, email, or phone" />
      </form>
      {customers && customers.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {customers.map((customer) => (
            <Link key={customer.id} href={`/customers/${customer.id}`}>
              <Card className="h-full transition hover:border-[var(--accent)]">
                <h2 className="text-xl font-semibold text-white">{customerName(customer)}</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">{customer.email || "No email"} · {customer.phone || "No phone"}</p>
                <p className="mt-4 text-sm leading-6 text-slate-300">{address([customer.address_line1, customer.city, customer.state, customer.zip])}</p>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="No customers found" body="Add your first customer or clear the search to see all saved contacts." action={<ButtonLink href="/customers/new">New Customer</ButtonLink>} />
      )}
    </>
  );
}
