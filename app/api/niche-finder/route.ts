import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, competition, search, count } = body;

    const webhookUrl = process.env.N8N_NICHE_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json({ error: "N8N_NICHE_WEBHOOK_URL not configured" }, { status: 500 });
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, competition, search, count: count || 8 }),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: `n8n error: ${text}` }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
