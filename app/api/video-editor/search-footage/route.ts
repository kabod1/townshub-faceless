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
        error: "PEXELS_API_KEY not configured.",
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

    interface PexelsVideoFile { quality: string; link: string; file_type: string; }
    interface PexelsVideo {
      id: number;
      duration: number;
      image: string;
      user: { name: string };
      video_pictures: { picture: string }[];
      video_files: PexelsVideoFile[];
    }

    const videos = (data.videos ?? []).map((v: PexelsVideo) => {
      // Prefer SD for faster loading; fall back to first available
      const file =
        v.video_files?.find((f: PexelsVideoFile) => f.quality === "sd" && f.file_type === "video/mp4") ??
        v.video_files?.find((f: PexelsVideoFile) => f.quality === "hd" && f.file_type === "video/mp4") ??
        v.video_files?.[0];

      // `image` is the top-level cover photo Pexels provides — most reliable thumbnail
      const thumb = v.image || v.video_pictures?.[0]?.picture || "";

      return {
        id: v.id,
        url: file?.link ?? "",
        thumb,
        duration: v.duration,
        author: v.user?.name ?? "",
      };
    }).filter((v: { url: string }) => v.url);

    return NextResponse.json({ videos });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error", videos: [] }, { status: 500 });
  }
}
