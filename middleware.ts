import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "th_auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth API and login page are always accessible
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Protect all dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const cookie = request.cookies.get(AUTH_COOKIE);
    if (!cookie?.value) {
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
