import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 120;

interface WhisperSegment {
  start: number;
  end: number;
  text: string;
}

interface WhisperWord {
  start: number;
  end: number;
  word: string;
}

interface WhisperResponse {
  text: string;
  segments: WhisperSegment[];
  words?: WhisperWord[];
}

// Group words/segments into caption chunks (max 6 words, max 3s each)
function buildCaptions(response: WhisperResponse) {
  const words: WhisperWord[] = response.words?.length
    ? response.words
    : response.segments.flatMap(s =>
        s.text.trim().split(/\s+/).map((w, i, arr) => ({
          word: w,
          start: s.start + (i / arr.length) * (s.end - s.start),
          end: s.start + ((i + 1) / arr.length) * (s.end - s.start),
        }))
      );

  const captions: { start: number; end: number; text: string }[] = [];
  let chunk: WhisperWord[] = [];

  for (const word of words) {
    chunk.push(word);
    const chunkDuration = chunk[chunk.length - 1].end - chunk[0].start;
    if (chunk.length >= 6 || chunkDuration >= 3) {
      captions.push({
        start: chunk[0].start,
        end: chunk[chunk.length - 1].end,
        text: chunk.map(w => w.word).join(" ").trim(),
      });
      chunk = [];
    }
  }
  if (chunk.length) {
    captions.push({
      start: chunk[0].start,
      end: chunk[chunk.length - 1].end,
      text: chunk.map(w => w.word).join(" ").trim(),
    });
  }
  return captions;
}

export async function POST(req: NextRequest) {
  try {
    const { videoUrl, videoId } = await req.json();
    if (!videoUrl || !videoId) {
      return NextResponse.json({ error: "videoUrl and videoId required" }, { status: 400 });
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
    }

    // Download video from Supabase storage
    const videoRes = await fetch(videoUrl);
    if (!videoRes.ok) throw new Error("Failed to fetch video file");
    const videoBlob = await videoRes.blob();

    // Whisper accepts video files directly (extracts audio internally)
    const formData = new FormData();
    formData.append("file", videoBlob, "video.mp4");
    formData.append("model", "whisper-1");
    formData.append("response_format", "verbose_json");
    formData.append("timestamp_granularities[]", "word");
    formData.append("timestamp_granularities[]", "segment");

    const whisperRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${openaiKey}` },
      body: formData,
    });

    if (!whisperRes.ok) {
      const err = await whisperRes.text();
      throw new Error(`Whisper error: ${err}`);
    }

    const transcript: WhisperResponse = await whisperRes.json();
    const captions = buildCaptions(transcript);

    // Save to DB
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    await supabase
      .from("user_videos")
      .update({ transcript, captions, status: "ready" })
      .eq("id", videoId);

    return NextResponse.json({ transcript, captions });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
