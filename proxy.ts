import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "th_auth";

async function isValidToken(token: string): Promise<boolean> {
  const secret = process.env.AUTH_SECRET ?? "th-secret-2026";
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length < 3) return false;

    const [username, timestamp, sig] = parts;
    const age = Date.now() - parseInt(timestamp, 10);
    // Reject tokens older than 30 days
    if (isNaN(age) || age > 1000 * 60 * 60 * 24 * 30) return false;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const data = new TextEncoder().encode(`${username}:${timestamp}`);
    const sigBytes = Buffer.from(sig, "hex");
    return await crypto.subtle.verify("HMAC", key, sigBytes, data);
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth API and login page are always accessible
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Protect all dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const cookie = request.cookies.get(AUTH_COOKIE);
    if (!cookie?.value || !(await isValidToken(cookie.value))) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
