import { createCustomer } from "@/app/actions/customers";
import { Card, Field, Notice, PageHeader, SubmitButton, TextArea } from "@/components/ui";

export default async function NewCustomerPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <PageHeader eyebrow="New contact" title="Create customer" />
      <Notice tone="error" message={params.error} />
      <Card>
        <form action={createCustomer} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="First name" name="first_name" />
            <Field label="Last name" name="last_name" />
            <Field label="Company name" name="company_name" />
            <Field label="Phone" name="phone" type="tel" />
            <Field label="Email" name="email" type="email" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Address line 1" name="address_line1" />
            <Field label="Address line 2" name="address_line2" />
            <Field label="City" name="city" />
            <Field label="State" name="state" />
            <Field label="Zip" name="zip" />
          </div>
          <TextArea label="Notes" name="notes" rows={6} />
          <SubmitButton>Create customer</SubmitButton>
        </form>
      </Card>
    </>
  );
}
