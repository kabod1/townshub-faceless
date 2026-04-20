import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query?.trim()) {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    const apiKey = process.env.PEXELS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        error: "PEXELS_API_KEY not configured. Add it to your environment variables.",
        videos: [],
      }, { status: 200 });
    }

    const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=9&orientation=landscape`;
    const response = await fetch(url, {
      headers: { Authorization: apiKey },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Pexels API error: ${response.status}`, videos: [] }, { status: 200 });
    }

    const data = await response.json();

    interface PexelsVideoFile { quality: string; link: string; }
    interface PexelsVideo {
      id: number;
      duration: number;
      user: { name: string };
      video_pictures: { picture: string }[];
      video_files: PexelsVideoFile[];
    }

    const videos = (data.videos ?? []).map((v: PexelsVideo) => {
      const hd = v.video_files?.find((f: PexelsVideoFile) => f.quality === "hd") ?? v.video_files?.[0];
      return {
        id: v.id,
        url: hd?.link ?? "",
        thumb: v.video_pictures?.[0]?.picture ?? "",
        duration: v.duration,
        author: v.user?.name ?? "",
      };
    }).filter((v: { url: string }) => v.url);

    return NextResponse.json({ videos });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error", videos: [] }, { status: 500 });
  }
}
