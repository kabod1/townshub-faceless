import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { prompt, width = 1280, height = 720 } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.FAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "FAL_API_KEY not configured" }, { status: 500 });
    }

    const response = await fetch("https://fal.run/fal-ai/flux/dev", {
      method: "POST",
      headers: {
        "Authorization": `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        image_size: { width, height },
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        enable_safety_checker: false,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `fal.ai error: ${err}` }, { status: 502 });
    }

    const data = await response.json();
    const url = data.images?.[0]?.url;

    if (!url) {
      return NextResponse.json({ error: "No image returned from fal.ai" }, { status: 502 });
    }

    return NextResponse.json({ url, seed: data.seed });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
