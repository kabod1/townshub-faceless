import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let file: File | null = null;
  let contentType = "video/webm";

  const ct = req.headers.get("content-type") || "";
  if (ct.includes("multipart/form-data")) {
    const formData = await req.formData();
    file = formData.get("video") as File;
    contentType = file?.type || "video/webm";
  } else {
    // Raw binary upload with ?filename= param
    const url = new URL(req.url);
    const filename = url.searchParams.get("filename") || `video-${Date.now()}.webm`;
    const buf = await req.arrayBuffer();
    file = new File([buf], filename, { type: "video/webm" });
  }

  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No video file provided" }, { status: 400 });
  }

  const ext = contentType.includes("mp4") ? "mp4" : "webm";
  const filename = `${Date.now()}-townshub.${ext}`;

  const bytes = await file.arrayBuffer();

  // Ensure bucket exists (creates silently if already there)
  await supabase.storage.createBucket("videos", { public: true }).catch(() => null);

  const { error } = await supabase.storage
    .from("videos")
    .upload(filename, bytes, { contentType, upsert: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("videos").getPublicUrl(filename);
  return NextResponse.json({ url: data.publicUrl, filename });
}
