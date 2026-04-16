import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { videoId, title, description, tags, categoryId, scheduledAt, privacyStatus } = body;

    if (!videoId) {
      return NextResponse.json({ error: "videoId is required" }, { status: 400 });
    }

    const webhookUrl = process.env.N8N_YOUTUBE_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json(
        {
          error:
            "N8N_YOUTUBE_WEBHOOK_URL is not configured. Add it to your .env.local file and to Vercel environment variables.",
        },
        { status: 500 }
      );
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoId,
        title: title || "",
        description: description || "",
        tags: tags || [],
        categoryId: categoryId || "22",
        scheduledAt: scheduledAt || null,
        privacyStatus: privacyStatus || "private",
      }),
    });

    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { error: `n8n webhook failed: ${text || `HTTP ${response.status}`}` },
        { status: 502 }
      );
    }

    if (!text || text.trim() === "") {
      return NextResponse.json(
        {
          error:
            "n8n returned an empty response. Check the workflow is active and configured to return data.",
        },
        { status: 502 }
      );
    }

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: `n8n returned invalid JSON: ${text.slice(0, 200)}` },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
