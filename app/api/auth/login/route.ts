import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "th_auth";

async function signToken(username: string, secret: string): Promise<string> {
  const timestamp = Date.now().toString();
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const data = new TextEncoder().encode(`${username}:${timestamp}`);
  const sig = await crypto.subtle.sign("HMAC", key, data);
  const sigHex = Buffer.from(sig).toString("hex");
  return Buffer.from(`${username}:${timestamp}:${sigHex}`).toString("base64");
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const validUser = process.env.AUTH_USERNAME ?? "townshub";
    const validPass = process.env.AUTH_PASSWORD ?? "townshub2026";

    if (username !== validUser || password !== validPass) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const secret = process.env.AUTH_SECRET ?? "th-secret-2026";
    const token = await signToken(username, secret);

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
