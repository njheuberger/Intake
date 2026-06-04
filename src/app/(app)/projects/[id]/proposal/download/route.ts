import { NextResponse } from "next/server";
import { proposalFilename, renderProposalPdf } from "@/lib/proposal-pdf";
import { getProposalData, ProposalProjectNotFoundError } from "@/lib/proposals";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  let proposalData;

  try {
    proposalData = await getProposalData(id);
  } catch (error) {
    if (error instanceof ProposalProjectNotFoundError) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    throw error;
  }
  const pdf = await renderProposalPdf(proposalData);
  const filename = proposalFilename(proposalData.project.project_name);

  const body = new Uint8Array(pdf);

  return new NextResponse(body, {
    headers: {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": "application/pdf",
      "Cache-Control": "no-store",
    },
  });
}
