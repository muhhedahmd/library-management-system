import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = [
  "/profile",
  "/checkout",
  "/todo",
  "/recommendation",
  "/upload",
  "/users",
  "/posts",
];

export default withAuth(
  async function middleware(request: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET!;
    const { pathname } = request.nextUrl;

    const token = await getToken({ req: request, secret, raw: true });

    const isProtected = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    // Only block /auth/* pages (not /api/auth/* which NextAuth needs)
    const isAuthPage =
      pathname.startsWith("/auth") && !pathname.startsWith("/api/auth");

    // Redirect authenticated users away from auth pages
    if (token && isAuthPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Redirect unauthenticated users away from protected routes
    if (!token && isProtected) {
      const callbackUrl = encodeURIComponent(request.url);
      return NextResponse.redirect(
        new URL(`/auth/signin?callbackUrl=${callbackUrl}`, request.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};
