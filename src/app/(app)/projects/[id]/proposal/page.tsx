import Image from "next/image";
import { notFound } from "next/navigation";
import { ButtonLink, PageHeader, SecondaryLink } from "@/components/ui";
import { address, currency, customerName, formatDate } from "@/lib/format";
import { getProposalData, ProposalProjectNotFoundError } from "@/lib/proposals";

const assumptions = [
  "Final pricing may change if project scope, site conditions, or customer requirements change.",
  "Customer is responsible for providing access to required areas during installation or service.",
  "Any electrical, structural, or network changes outside the documented scope may require a revised estimate.",
  "Hardware, software, materials, and third-party service costs are subject to availability and vendor pricing.",
];

const nextSteps = ["Review proposal", "Confirm scope", "Approve estimate", "Schedule work"];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="break-inside-avoid rounded-lg border border-slate-300 bg-white p-5 text-slate-950 shadow-sm">
      <h2 className="border-b border-slate-200 pb-3 text-xl font-semibold text-slate-950">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ProposalText({ value, fallback = "To be confirmed during final scope review." }: { value?: string | null; fallback?: string }) {
  return <p className="whitespace-pre-wrap leading-7 text-slate-700">{value || fallback}</p>;
}

function ProposalEmpty({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-5">
      <h3 className="font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}

export default async function ProjectProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let proposalData;

  try {
    proposalData = await getProposalData(id);
  } catch (error) {
    if (error instanceof ProposalProjectNotFoundError) notFound();
    throw error;
  }

  const { project, latestVisit, estimateItems, photos } = proposalData;
  const customer = project.customers;
  const proposalDate = new Date().toISOString();
  const subtotal = estimateItems.reduce((sum, item) => sum + (item.total ?? 0), 0);
  const customerAddress = address([
    customer?.address_line1,
    customer?.address_line2,
    customer?.city,
    customer?.state,
    customer?.zip,
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Proposal Preview"
        title={project.project_name || "Untitled project"}
        actions={
          <>
            <SecondaryLink href={`/projects/${id}`}>Back to Project</SecondaryLink>
            <ButtonLink href={`/projects/${id}/proposal/download`}>Download PDF</ButtonLink>
          </>
        }
      />

      <div className="mb-5 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-6 text-slate-300">
        Review the proposal preview below, then use Download PDF to generate a branded customer-ready document.
      </div>

      <article className="mx-auto max-w-5xl space-y-5 rounded-lg bg-slate-100 p-4 text-slate-950 shadow-2xl shadow-black/30 sm:p-6 lg:p-8">
        <header className="rounded-lg border border-slate-300 bg-[#050505] p-5 text-white sm:p-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">DesignSwiss Proposal</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">{project.project_name || "Project Proposal"}</h1>
              <p className="mt-2 text-base text-slate-300">{project.project_type || "Project type pending"}</p>
            </div>
            <div className="relative h-24 w-44 shrink-0">
              <Image src="/images/designswiss-logo.png" alt="DesignSwiss" fill priority sizes="176px" className="object-contain" />
            </div>
          </div>
          <div className="mt-6 grid gap-3 text-sm text-slate-200 sm:grid-cols-3">
            <div>
              <span className="block text-slate-400">Proposal date</span>
              <strong>{formatDate(proposalDate)}</strong>
            </div>
            <div>
              <span className="block text-slate-400">Project status</span>
              <strong>{project.project_status || "New"}</strong>
            </div>
            <div>
              <span className="block text-slate-400">Prepared for</span>
              <strong>{customerName(customer)}</strong>
            </div>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-2">
          <Section title="Customer Information">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="font-semibold text-slate-500">Name</dt><dd>{customerName(customer)}</dd></div>
              <div><dt className="font-semibold text-slate-500">Company</dt><dd>{customer?.company_name || "Not provided"}</dd></div>
              <div><dt className="font-semibold text-slate-500">Email</dt><dd>{customer?.email || "Not provided"}</dd></div>
              <div><dt className="font-semibold text-slate-500">Phone</dt><dd>{customer?.phone || "Not provided"}</dd></div>
              <div className="sm:col-span-2"><dt className="font-semibold text-slate-500">Address</dt><dd>{customerAddress}</dd></div>
            </dl>
          </Section>

          <Section title="Project Summary">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="font-semibold text-slate-500">Project name</dt><dd>{project.project_name || "Untitled project"}</dd></div>
              <div><dt className="font-semibold text-slate-500">Project type</dt><dd>{project.project_type || "Not selected"}</dd></div>
              <div><dt className="font-semibold text-slate-500">Timeline</dt><dd>{project.target_timeline || "To be scheduled"}</dd></div>
              <div><dt className="font-semibold text-slate-500">Budget range</dt><dd>{project.budget_range || "Not provided"}</dd></div>
            </dl>
            <div className="mt-4">
              <h3 className="font-semibold text-slate-950">Requested work</h3>
              <ProposalText value={project.requested_work} />
            </div>
          </Section>
        </div>

        <Section title="Scope of Work">
          {latestVisit ? (
            <div className="grid gap-5">
              <div>
                <h3 className="font-semibold text-slate-950">Existing conditions</h3>
                <ProposalText value={latestVisit.existing_conditions} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-950">Measurements and site details</h3>
                <ProposalText value={latestVisit.measurements} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-950">Requirements</h3>
                <ProposalText value={latestVisit.requirements} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-950">Customer concerns and follow-up items</h3>
                <ProposalText
                  value={[latestVisit.customer_concerns, latestVisit.follow_up_items].filter(Boolean).join("\n\n")}
                  fallback="No customer concerns or follow-up items have been documented yet."
                />
              </div>
            </div>
          ) : (
            <ProposalText fallback="No site visit has been recorded yet. Scope details will be confirmed before final approval." />
          )}
        </Section>

        <Section title="Estimate">
          {estimateItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-600">
                    <th className="py-3 pr-3">Item type</th>
                    <th className="py-3 pr-3">Description</th>
                    <th className="py-3 pr-3 text-right">Qty</th>
                    <th className="py-3 pr-3 text-right">Unit cost</th>
                    <th className="py-3 pr-3 text-right">Labor hrs</th>
                    <th className="py-3 pr-3 text-right">Labor rate</th>
                    <th className="py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {estimateItems.map((item) => (
                    <tr key={item.id} className="border-b border-slate-200 align-top">
                      <td className="py-3 pr-3 font-semibold">{item.item_type || "Item"}</td>
                      <td className="py-3 pr-3">{item.description || "No description"}</td>
                      <td className="py-3 pr-3 text-right">{item.quantity ?? 0}</td>
                      <td className="py-3 pr-3 text-right">{currency(item.unit_cost)}</td>
                      <td className="py-3 pr-3 text-right">{item.labor_hours ?? 0}</td>
                      <td className="py-3 pr-3 text-right">{currency(item.labor_rate)}</td>
                      <td className="py-3 text-right font-semibold">{currency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-5 flex justify-end">
                <dl className="w-full max-w-sm space-y-3 text-sm">
                  <div className="flex justify-between border-b border-slate-300 pb-2"><dt>Subtotal</dt><dd>{currency(subtotal)}</dd></div>
                  <div className="flex justify-between text-lg font-semibold"><dt>Total estimated amount</dt><dd>{currency(subtotal)}</dd></div>
                </dl>
              </div>
            </div>
          ) : (
            <ProposalEmpty title="No estimate items yet" body="Add estimate items to show pricing in this proposal." />
          )}
        </Section>

        <Section title="Project Photos">
          {photos.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {photos.map((photo) => (
                <figure key={photo.id} className="overflow-hidden rounded-md border border-slate-300 bg-slate-50">
                  <div className="aspect-[4/3] bg-slate-200">
                    {photo.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo.url} alt={photo.caption || photo.category || "Project photo"} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <figcaption className="p-3 text-sm text-slate-700">
                    <strong>{photo.category || "Photo"}</strong>
                    {photo.caption ? <span className="block">{photo.caption}</span> : null}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <ProposalText fallback="No project photos are currently attached to this proposal." />
          )}
        </Section>

        <div className="grid gap-5 lg:grid-cols-2">
          <Section title="Assumptions">
            <ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-slate-700">
              {assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}
            </ul>
          </Section>

          <Section title="Next Steps">
            <ol className="list-decimal space-y-3 pl-5 text-sm leading-6 text-slate-700">
              {nextSteps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </Section>
        </div>

        <Section title="Signature / Acceptance">
          <div className="grid gap-8 pt-6 sm:grid-cols-3">
            <div className="border-t border-slate-400 pt-2 text-sm text-slate-600">Customer Name</div>
            <div className="border-t border-slate-400 pt-2 text-sm text-slate-600">Signature</div>
            <div className="border-t border-slate-400 pt-2 text-sm text-slate-600">Date</div>
          </div>
        </Section>

      </article>
    </>
  );
}
