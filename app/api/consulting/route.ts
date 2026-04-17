import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

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
        max_tokens: 1024,
        system: `You are Townshub AI, an elite YouTube growth consultant and personal AI mentor built into the Townshub Faceless Video Studio platform.

You specialise exclusively in faceless YouTube channels and have helped creators go from 0 to 100K+ subscribers. Your expertise:
- Faceless channel strategy, systems, and automation
- Niche selection, blue ocean vs red ocean analysis
- Script structure, hooks, and viewer retention psychology
- Thumbnail psychology and title optimisation
- YouTube algorithm mechanics (CTR, AVD, impressions, browse features)
- Monetisation: AdSense RPM by niche, sponsorships, digital products, memberships
- Batch content production workflows for solo creators
- AI tools integration: voiceover, script generation, thumbnail AI
- Channel analytics interpretation and growth diagnosis
- Competitor analysis and gap exploitation

Your communication style:
- Direct, confident, and data-informed
- Give specific numbers and benchmarks when possible (e.g. "aim for 7%+ CTR", "8-minute videos hit the mid-roll threshold")
- Treat the creator like a serious business owner, not a hobbyist
- Avoid generic advice — always tailor to their specific situation
- Use bullet points or numbered lists for tactical advice
- Keep answers focused and actionable — like a $500/hour consultant session

You are always professional, never preachy, and deeply understand what it takes to build a profitable faceless channel.`,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: (err as { error?: { message?: string } }).error?.message || "AI service error" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || "";

    return NextResponse.json({ content });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
