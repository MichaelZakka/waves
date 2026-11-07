import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, tokenLooksValid } from "@/lib/auth/session";

/*
 * First line of defence for the admin area: bounce visitors without a
 * current-looking session to the login page. The signature itself is checked
 * by every admin page, Server Function and upload, which can read the key.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  if (tokenLooksValid(request.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const login = new URL("/admin/login", request.url);
  login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
