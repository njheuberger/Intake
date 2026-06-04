/* eslint-disable jsx-a11y/alt-text */
import { Document, Image, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { address, currency, customerName, formatDate } from "@/lib/format";
import type { ProposalData } from "@/lib/proposals";

const assumptions = [
  "Final pricing may change if project scope, site conditions, or customer requirements change.",
  "Customer is responsible for providing access to required areas during installation or service.",
  "Any electrical, structural, or network changes outside the documented scope may require a revised estimate.",
  "Hardware, software, materials, and third-party service costs are subject to availability and vendor pricing.",
];

const nextSteps = ["Review proposal", "Confirm scope", "Approve estimate", "Schedule work"];

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    color: "#111827",
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.45,
    paddingBottom: 36,
    paddingLeft: 36,
    paddingRight: 36,
    paddingTop: 36,
  },
  header: {
    backgroundColor: "#050505",
    borderRadius: 6,
    color: "#ffffff",
    marginBottom: 18,
    padding: 20,
  },
  headerRow: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logo: {
    height: 72,
    objectFit: "contain",
    width: 112,
  },
  eyebrow: {
    color: "#d1d5db",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1.2,
    marginBottom: 7,
    textTransform: "uppercase",
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 6,
  },
  subtitle: {
    color: "#d1d5db",
    fontSize: 11,
  },
  metaGrid: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    color: "#9ca3af",
    fontSize: 8,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  metaValue: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: 700,
  },
  twoColumn: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  column: {
    flex: 1,
  },
  section: {
    borderColor: "#d1d5db",
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  sectionTitle: {
    borderBottomColor: "#e5e7eb",
    borderBottomWidth: 1,
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
    paddingBottom: 7,
  },
  label: {
    color: "#6b7280",
    fontSize: 8,
    fontWeight: 700,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  value: {
    color: "#111827",
    fontSize: 10,
    marginBottom: 7,
  },
  paragraph: {
    color: "#374151",
    fontSize: 10,
    marginBottom: 8,
  },
  subsectionTitle: {
    color: "#111827",
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 4,
  },
  table: {
    borderColor: "#d1d5db",
    borderWidth: 1,
    marginTop: 3,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
    borderBottomColor: "#d1d5db",
    borderBottomWidth: 1,
    fontWeight: 700,
  },
  cell: {
    borderRightColor: "#e5e7eb",
    borderRightWidth: 1,
    flex: 1,
    fontSize: 8,
    padding: 5,
  },
  descriptionCell: {
    flex: 2,
  },
  totalCell: {
    borderRightWidth: 0,
    textAlign: "right",
  },
  estimateTotal: {
    alignSelf: "flex-end",
    marginTop: 10,
    width: 220,
  },
  totalRow: {
    borderTopColor: "#d1d5db",
    borderTopWidth: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 6,
  },
  totalText: {
    fontSize: 12,
    fontWeight: 700,
  },
  listItem: {
    color: "#374151",
    fontSize: 10,
    marginBottom: 5,
  },
  photoGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  photoCard: {
    borderColor: "#d1d5db",
    borderRadius: 5,
    borderWidth: 1,
    overflow: "hidden",
    width: "48%",
  },
  photo: {
    height: 120,
    objectFit: "cover",
    width: "100%",
  },
  photoCaption: {
    fontSize: 8,
    padding: 6,
  },
  signatureGrid: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    marginTop: 28,
  },
  signatureLine: {
    borderTopColor: "#6b7280",
    borderTopWidth: 1,
    flex: 1,
    paddingTop: 5,
  },
  footer: {
    bottom: 16,
    color: "#6b7280",
    fontSize: 8,
    left: 36,
    position: "absolute",
    right: 36,
    textAlign: "center",
  },
});

function field(label: string, value?: string | null) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "Not provided"}</Text>
    </View>
  );
}

function textBlock(title: string, value?: string | null, fallback = "To be confirmed during final scope review.") {
  return (
    <View wrap={false}>
      <Text style={styles.subsectionTitle}>{title}</Text>
      <Text style={styles.paragraph}>{value || fallback}</Text>
    </View>
  );
}

async function localImageDataUri(path: string) {
  const image = await readFile(join(process.cwd(), path));
  return `data:image/png;base64,${image.toString("base64")}`;
}

async function remoteImageDataUri(url: string) {
  if (!url) return "";
  try {
    const response = await fetch(url);
    if (!response.ok) return "";
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = Buffer.from(await response.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch {
    return "";
  }
}

function ProposalDocument({
  data,
  logo,
  photoDataUris,
}: {
  data: ProposalData;
  logo: string;
  photoDataUris: string[];
}) {
  const { project, latestVisit, estimateItems, photos } = data;
  const customer = project.customers;
  const subtotal = estimateItems.reduce((sum, item) => sum + (item.total ?? 0), 0);
  const proposalDate = new Date().toISOString();
  const customerAddress = address([
    customer?.address_line1,
    customer?.address_line2,
    customer?.city,
    customer?.state,
    customer?.zip,
  ]);

  return (
    <Document author="DesignSwiss" subject="Customer project proposal" title={`DesignSwiss Proposal - ${project.project_name || "Project"}`}>
      <Page size="LETTER" style={styles.page} wrap>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.eyebrow}>DesignSwiss Proposal</Text>
              <Text style={styles.title}>{project.project_name || "Project Proposal"}</Text>
              <Text style={styles.subtitle}>{project.project_type || "Project type pending"}</Text>
            </View>
            <Image src={logo} style={styles.logo} />
          </View>
          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Proposal date</Text>
              <Text style={styles.metaValue}>{formatDate(proposalDate)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Project status</Text>
              <Text style={styles.metaValue}>{project.project_status || "New"}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Prepared for</Text>
              <Text style={styles.metaValue}>{customerName(customer)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.twoColumn}>
          <View style={[styles.section, styles.column]}>
            <Text style={styles.sectionTitle}>Customer Information</Text>
            {field("Name", customerName(customer))}
            {field("Company", customer?.company_name)}
            {field("Email", customer?.email)}
            {field("Phone", customer?.phone)}
            {field("Address", customerAddress)}
          </View>

          <View style={[styles.section, styles.column]}>
            <Text style={styles.sectionTitle}>Project Summary</Text>
            {field("Project name", project.project_name)}
            {field("Project type", project.project_type)}
            {field("Timeline", project.target_timeline || "To be scheduled")}
            {field("Budget range", project.budget_range)}
            {textBlock("Requested work", project.requested_work)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scope of Work</Text>
          {latestVisit ? (
            <>
              {textBlock("Existing conditions", latestVisit.existing_conditions)}
              {textBlock("Measurements and site details", latestVisit.measurements)}
              {textBlock("Requirements", latestVisit.requirements)}
              {textBlock(
                "Customer concerns and follow-up items",
                [latestVisit.customer_concerns, latestVisit.follow_up_items].filter(Boolean).join("\n\n"),
                "No customer concerns or follow-up items have been documented yet.",
              )}
            </>
          ) : (
            <Text style={styles.paragraph}>No site visit has been recorded yet. Scope details will be confirmed before final approval.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estimate</Text>
          {estimateItems.length > 0 ? (
            <>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.cell}>Type</Text>
                  <Text style={[styles.cell, styles.descriptionCell]}>Description</Text>
                  <Text style={styles.cell}>Qty</Text>
                  <Text style={styles.cell}>Unit</Text>
                  <Text style={styles.cell}>Hours</Text>
                  <Text style={styles.cell}>Rate</Text>
                  <Text style={[styles.cell, styles.totalCell]}>Total</Text>
                </View>
                {estimateItems.map((item) => (
                  <View key={item.id} style={styles.tableRow} wrap={false}>
                    <Text style={styles.cell}>{item.item_type || "Item"}</Text>
                    <Text style={[styles.cell, styles.descriptionCell]}>{item.description || "No description"}</Text>
                    <Text style={styles.cell}>{item.quantity ?? 0}</Text>
                    <Text style={styles.cell}>{currency(item.unit_cost)}</Text>
                    <Text style={styles.cell}>{item.labor_hours ?? 0}</Text>
                    <Text style={styles.cell}>{currency(item.labor_rate)}</Text>
                    <Text style={[styles.cell, styles.totalCell]}>{currency(item.total)}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.estimateTotal}>
                <View style={styles.totalRow}>
                  <Text>Subtotal</Text>
                  <Text>{currency(subtotal)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalText}>Total estimated amount</Text>
                  <Text style={styles.totalText}>{currency(subtotal)}</Text>
                </View>
              </View>
            </>
          ) : (
            <Text style={styles.paragraph}>No estimate items have been added yet.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Photos</Text>
          {photos.length > 0 ? (
            <View style={styles.photoGrid}>
              {photos.map((photo, index) => (
                <View key={photo.id} style={styles.photoCard} wrap={false}>
                  {photoDataUris[index] ? <Image src={photoDataUris[index]} style={styles.photo} /> : null}
                  <Text style={styles.photoCaption}>
                    {photo.category || "Photo"}
                    {photo.caption ? ` - ${photo.caption}` : ""}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.paragraph}>No project photos are currently attached to this proposal.</Text>
          )}
        </View>

        <View style={styles.twoColumn}>
          <View style={[styles.section, styles.column]}>
            <Text style={styles.sectionTitle}>Assumptions</Text>
            {assumptions.map((assumption) => <Text key={assumption} style={styles.listItem}>- {assumption}</Text>)}
          </View>
          <View style={[styles.section, styles.column]}>
            <Text style={styles.sectionTitle}>Next Steps</Text>
            {nextSteps.map((step, index) => <Text key={step} style={styles.listItem}>{index + 1}. {step}</Text>)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Signature / Acceptance</Text>
          <View style={styles.signatureGrid}>
            <View style={styles.signatureLine}><Text>Customer Name</Text></View>
            <View style={styles.signatureLine}><Text>Signature</Text></View>
            <View style={styles.signatureLine}><Text>Date</Text></View>
          </View>
        </View>

        <Text fixed style={styles.footer}>DesignSwiss Intake Proposal</Text>
      </Page>
    </Document>
  );
}

export async function renderProposalPdf(data: ProposalData) {
  const [logo, photoDataUris] = await Promise.all([
    localImageDataUri("public/images/designswiss-logo.png"),
    Promise.all(data.photos.map((photo) => remoteImageDataUri(photo.url))),
  ]);

  return renderToBuffer(<ProposalDocument data={data} logo={logo} photoDataUris={photoDataUris} />);
}

export function proposalFilename(projectName?: string | null, date = new Date()) {
  const safeName = (projectName || "Project")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "Project";
  const stamp = date.toISOString().slice(0, 10);
  return `DesignSwiss-Proposal-${safeName}-${stamp}.pdf`;
}
