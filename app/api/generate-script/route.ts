import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { videoIdea, targetLength, format, researchNotes, writingStyle } = body;

    if (!videoIdea) {
      return NextResponse.json({ error: "videoIdea is required" }, { status: 400 });
    }

    const webhookUrl = process.env.N8N_SCRIPT_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json({ error: "N8N_SCRIPT_WEBHOOK_URL not configured" }, { status: 500 });
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoIdea,
        targetLength: targetLength || "10",
        format: format || "listicle",
        researchNotes: researchNotes || [],
        writingStyle: writingStyle || "educational",
      }),
    });

    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json({ error: `n8n webhook failed: ${text || `HTTP ${response.status}`}` }, { status: 502 });
    }

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "n8n returned an empty response. Check the workflow is active and configured to return data." }, { status: 502 });
    }

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: `n8n returned invalid JSON: ${text.slice(0, 200)}` }, { status: 502 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
