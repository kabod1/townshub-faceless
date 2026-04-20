import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();
    if (!topic?.trim()) {
      return NextResponse.json({ error: "topic is required" }, { status: 400 });
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
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2000,
        messages: [{
          role: "user",
          content: `You are an expert faceless YouTube video producer. Create a detailed scene-by-scene plan for a video on this topic: "${topic}"

Generate 6-10 scenes. For each scene, provide:
- title: short scene name (3-6 words)
- script: narration text for this scene (2-4 sentences, engaging and informative)
- prompt: cinematic AI image generation prompt for a faceless YouTube video (no people/faces, purely visual atmosphere — 1 sentence)
- duration: estimated duration in seconds (5-15)

Respond ONLY with valid JSON in this exact format:
{
  "scenes": [
    {
      "title": "Scene title",
      "script": "Narration text for this scene.",
      "prompt": "Cinematic visual prompt for AI image generation.",
      "duration": 8
    }
  ]
}`,
        }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json({ error: (err as { error?: { message?: string } }).error?.message || "AI error" }, { status: 502 });
    }

    const data = await response.json();
    const text: string = data.content?.[0]?.text?.trim() ?? "";

    let parsed: { scenes: { title: string; script: string; prompt: string; duration: number }[] };
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch?.[0] ?? text);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response as JSON", raw: text }, { status: 502 });
    }

    return NextResponse.json({ scenes: parsed.scenes ?? [] });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
