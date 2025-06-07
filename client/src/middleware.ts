import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getSessionToken(request: NextRequest) {
  const sessionToken = request.cookies.get("sessionToken")?.value || null;
  return sessionToken;
}

export function middleware(request: NextRequest) {
  const sessionToken = getSessionToken(request);
  const { pathname } = request.nextUrl;

  if (sessionToken && (pathname === "/sign-in" || pathname === "/sign-up")) {
    console.log("✅ Logged in. Redirecting to /admin");
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (!sessionToken && pathname.startsWith("/shops")) {
    console.log("🚨 No credentials. Redirecting to /sign-in");
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/shops/:path*", "/admin/:path*"],
};
