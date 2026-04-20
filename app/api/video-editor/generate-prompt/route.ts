import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { script } = await req.json();
    if (!script?.trim()) {
      return NextResponse.json({ error: "script is required" }, { status: 400 });
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
        max_tokens: 200,
        messages: [{
          role: "user",
          content: `Convert this YouTube narration script excerpt into a cinematic AI image generation prompt. The image should be suitable for a faceless YouTube video — no people/faces, purely visual. Focus on atmosphere, setting, and mood.

Script: "${script.slice(0, 500)}"

Respond with ONLY the image prompt — 1-2 sentences, highly descriptive, cinematic quality. Include style cues like "photorealistic", "8K", "golden hour lighting", "aerial view" etc as relevant.`,
        }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json({ error: (err as { error?: { message?: string } }).error?.message || "AI error" }, { status: 502 });
    }

    const data = await response.json();
    const prompt = data.content?.[0]?.text?.trim() ?? "";
    return NextResponse.json({ prompt });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
