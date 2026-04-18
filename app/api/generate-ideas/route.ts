import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { niche, count } = body;

    const webhookUrl = process.env.N8N_IDEAS_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json({ error: "N8N_IDEAS_WEBHOOK_URL not configured" }, { status: 500 });
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche: niche || "faceless YouTube content creation", count: count || 6 }),
    });

    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json({ error: `n8n error: ${text || `HTTP ${response.status}`}` }, { status: 502 });
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
