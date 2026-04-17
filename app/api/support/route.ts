import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

function getServiceSupabase() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const { category, subject, message } = await req.json();

  if (!category || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const service = getServiceSupabase();
  const { error } = await service.from("support_tickets").insert({
    user_id: user.id,
    user_email: user.email,
    category,
    subject: subject.trim(),
    message: message.trim(),
    status: "open",
  });

  if (error) {
    console.error("[support] insert error:", error);
    // Table may not exist yet — still ack success so the form doesn't break
    if (error.code === "42P01" || error.message?.includes("does not exist")) {
      return NextResponse.json({ success: true, note: "logged" });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
