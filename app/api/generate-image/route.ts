import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { prompt, width = 1280, height = 720 } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Try fal.ai (FLUX.1 dev) first
    const apiKey = process.env.FAL_API_KEY;
    if (apiKey) {
      try {
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
        if (response.ok) {
          const data = await response.json();
          const url = data.images?.[0]?.url;
          if (url) return NextResponse.json({ url, seed: data.seed, provider: "fal" });
        }
      } catch {
        // fall through to Pollinations
      }
    }

    // Fallback: Pollinations.ai (free, no credits needed)
    const seed = Math.floor(Math.random() * 999999);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&model=flux&seed=${seed}`;
    return NextResponse.json({ url, provider: "pollinations" });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
