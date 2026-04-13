import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "th_auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const validUser = process.env.AUTH_USERNAME ?? "townshub";
    const validPass = process.env.AUTH_PASSWORD ?? "townshub2026";

    if (username !== validUser || password !== validPass) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    // Simple signed token: base64(user:timestamp:secret)
    const secret = process.env.AUTH_SECRET ?? "th-secret-2026";
    const token = Buffer.from(`${username}:${Date.now()}:${secret}`).toString("base64");

    const res = NextResponse.json({ ok: true });
    res.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
