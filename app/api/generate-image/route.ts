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

    // Fallback: Pollinations.ai — download server-side and return data URL for reliability
    const seed = Math.floor(Math.random() * 999999);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&model=flux&seed=${seed}&nofeed=true`;

    let attempt = 0;
    while (attempt < 3) {
      try {
        const imgRes = await fetch(pollinationsUrl, { signal: AbortSignal.timeout(55000) });
        if (!imgRes.ok) throw new Error(`Pollinations ${imgRes.status}`);
        const contentType = imgRes.headers.get("content-type") || "image/jpeg";
        const buffer = await imgRes.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const dataUrl = `data:${contentType};base64,${base64}`;
        return NextResponse.json({ url: dataUrl, provider: "pollinations" });
      } catch {
        attempt++;
        if (attempt >= 3) break;
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    return NextResponse.json({ error: "Image generation failed after retries. Try again." }, { status: 502 });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
