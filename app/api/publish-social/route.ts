import { NextRequest, NextResponse } from "next/server";

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

  let res: Response;
  try {
    res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
