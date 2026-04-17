import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { niche1, niche2, targetAudience } = await req.json();

    if (!niche1 || !niche2) {
      return NextResponse.json({ error: "Both niches are required" }, { status: 400 });
    }

    // Try n8n first
    const webhookUrl = process.env.N8N_NICHE_BENDING_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ niche1, niche2, targetAudience }),
          signal: AbortSignal.timeout(30000),
        });
        if (res.ok) {
          const data = await res.json();
          return NextResponse.json(data);
        }
      } catch {
        // fall through to Anthropic
      }
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI service not configured. Set ANTHROPIC_API_KEY." }, { status: 500 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-6",
        max_tokens: 2048,
        system: "You are a YouTube niche strategy expert specialising in hybrid and blue-ocean channel concepts. Return only valid JSON — no markdown, no explanation.",
        messages: [
          {
            role: "user",
            content: `Analyse blending these two YouTube niches: "${niche1}" + "${niche2}".${targetAudience ? ` Target audience: ${targetAudience}.` : ""}

Return a single JSON object exactly matching this schema:
{
  "blendedNicheName": "catchy name for this combined niche",
  "tagline": "one-line pitch for the channel concept",
  "opportunityScore": 82,
  "opportunity": "High",
  "marketSize": "2.4M monthly searches",
  "competitionLevel": "Low",
  "avgRPM": "$8–14",
  "contentIdeas": ["idea 1", "idea 2", "idea 3", "idea 4", "idea 5"],
  "whyItWorks": "2–3 sentences explaining the synergy",
  "uniqueAngle": "what makes this blend stand out on YouTube",
  "channelPersona": "describe the ideal faceless channel persona",
  "monetisationPaths": ["path 1", "path 2", "path 3"],
  "topKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "warnings": "any risks or downsides, or null if none",
  "exampleTitles": ["Example Title 1", "Example Title 2", "Example Title 3"]
}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Invalid AI response format" }, { status: 502 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
