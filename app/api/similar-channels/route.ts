import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { channelName, niche, description } = await req.json();

    if (!channelName) {
      return NextResponse.json({ error: "channelName is required" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
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
        system: "You are a YouTube competitive intelligence analyst. Return only valid JSON — no markdown, no explanation, no code fences.",
        messages: [
          {
            role: "user",
            content: `Find 6 real YouTube channels that are similar to "${channelName}"${niche ? ` in the "${niche}" niche` : ""}.${description ? ` Context: ${description}` : ""}

Return a JSON array of exactly 6 channel objects:
[
  {
    "name": "Channel Name",
    "handle": "@handle",
    "niche": "specific niche/topic",
    "subscribers": "e.g. 1.2M",
    "avgViews": "e.g. 85K",
    "uploadFreq": "e.g. 2x/week",
    "contentStyle": "brief description of their style",
    "whyRelevant": "why this is similar to the input channel",
    "monetisationHints": "how they likely monetise (AdSense, sponsors, products)",
    "growthTrend": "up",
    "rpmEst": "$6–12",
    "strengths": ["strength 1", "strength 2"],
    "gapOpportunity": "specific content gap you could exploit vs this channel",
    "collab": "potential collaboration angle"
  }
]`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Invalid AI response" }, { status: 502 });
    }

    const channels = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ data: { channels } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
