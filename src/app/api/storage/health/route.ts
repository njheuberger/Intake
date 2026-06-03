import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PROJECT_PHOTOS_BUCKET } from "@/lib/storage";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase.storage.from(PROJECT_PHOTOS_BUCKET).list("", {
    limit: 1,
  });

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        bucket: PROJECT_PHOTOS_BUCKET,
        error: error.message,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    bucket: PROJECT_PHOTOS_BUCKET,
    visibleObjects: data.length,
  });
}
