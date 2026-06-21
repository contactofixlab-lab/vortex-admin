import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Las rutas de login no necesitan protección
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // Proteger todas las demás rutas
  const sessionToken = request.cookies.get("vortex_admin_session")?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
