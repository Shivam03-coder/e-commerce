import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getSessionToken(request: NextRequest) {
  return (
    request.cookies.get("accessToken")?.value &&
    request.cookies.get("refreshToken")?.value
  );
}

export function middleware(request: NextRequest) {
  const hasToken = Boolean(getSessionToken(request));
  const { pathname } = request.nextUrl;

  const protectedPaths = ["/shop", "/admin"];
  const authPaths = ["/sign-in", "/sign-up"];

  if (hasToken && authPaths.some((path) => pathname.startsWith(path))) {
    const url = request.nextUrl.clone();
    url.pathname = "/shop";
    console.log("Redirecting authenticated user from auth page to /shop");
    return NextResponse.redirect(url);
  }

  if (!hasToken && protectedPaths.some((path) => pathname.startsWith(path))) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    console.log("Redirecting unauthenticated user to sign-in");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/shop/:path*", "/admin/:path*"],
};
