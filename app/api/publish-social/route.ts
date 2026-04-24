import { NextRequest, NextResponse } from "next/server";

// Expected dimensions per platform — n8n workflows can use these to transcode
// before uploading. Browser renders at these exact resolutions when the user
// picks the matching format in the Video Editor.
const PLATFORM_FORMAT: Record<string, { width: number; height: number; ratio: string; fps: number }> = {
  youtube:   { width: 1280, height: 720,  ratio: "16:9", fps: 30 },
  facebook:  { width: 1280, height: 720,  ratio: "16:9", fps: 30 },
  twitter:   { width: 1280, height: 720,  ratio: "16:9", fps: 30 },
  tiktok:    { width: 720,  height: 1280, ratio: "9:16", fps: 30 },
  instagram: { width: 720,  height: 1280, ratio: "9:16", fps: 30 },
};

const WEBHOOKS: Record<string, string | undefined> = {
  youtube:   process.env.N8N_YOUTUBE_UPLOAD_WEBHOOK_URL,
  tiktok:    process.env.N8N_TIKTOK_UPLOAD_WEBHOOK_URL,
  instagram: process.env.N8N_INSTAGRAM_UPLOAD_WEBHOOK_URL,
  facebook:  process.env.N8N_FACEBOOK_UPLOAD_WEBHOOK_URL,
  twitter:   process.env.N8N_TWITTER_UPLOAD_WEBHOOK_URL,
};

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { platform, ...payload } = body as { platform: string } & Record<string, unknown>;

  if (!platform) {
    return NextResponse.json({ error: "platform is required" }, { status: 400 });
  }

  const webhookUrl = WEBHOOKS[platform];
  if (!webhookUrl) {
    return NextResponse.json(
      { error: `${platform} upload webhook not configured. Add N8N_${platform.toUpperCase()}_UPLOAD_WEBHOOK_URL to your environment.` },
      { status: 400 }
    );
  }

  // Inject platform format spec so n8n can validate or transcode accordingly
  const formatSpec = PLATFORM_FORMAT[platform] ?? PLATFORM_FORMAT.youtube;

  let res: Response;
  try {
    res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, formatSpec }),
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to reach n8n webhook" },
      { status: 502 }
    );
  }

  const text = await res.text();
  let data: unknown = {};
  try { data = JSON.parse(text); } catch { data = { raw: text }; }

  if (!res.ok) {
    return NextResponse.json({ error: "Upload workflow failed", details: data }, { status: res.status });
  }
  return NextResponse.json(data);
}
