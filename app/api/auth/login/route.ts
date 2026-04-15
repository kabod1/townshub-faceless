// Auth is now handled client-side via Supabase SDK.
// This route is kept for backwards compat — it's no longer used.
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Use Supabase client auth" }, { status: 410 });
}
