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

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `n8n webhook failed: ${errorText}` }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
