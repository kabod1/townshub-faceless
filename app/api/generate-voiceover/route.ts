import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, voiceId, stability, similarityBoost, speed } = body;

    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const webhookUrl = process.env.N8N_VOICEOVER_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json(
        {
          error:
            "N8N_VOICEOVER_WEBHOOK_URL is not configured. Add it to your .env.local file and to Vercel environment variables.",
        },
        { status: 500 }
      );
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        voiceId: voiceId || "pNInz6obpgDQGcFmaJgB",
        stability: stability ?? 0.5,
        similarityBoost: similarityBoost ?? 0.75,
        speed: speed ?? 1.0,
      }),
    });

    const text2 = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { error: `n8n webhook failed: ${text2 || `HTTP ${response.status}`}` },
        { status: 502 }
      );
    }

    if (!text2 || text2.trim() === "") {
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
      data = JSON.parse(text2);
    } catch {
      return NextResponse.json(
        { error: `n8n returned invalid JSON: ${text2.slice(0, 200)}` },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
