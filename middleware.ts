import {  getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  async function middleware(Request: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET!;

    const pathname = Request.nextUrl.pathname;
    const isAuth = await getToken({
      req: Request,
      secret: secret,
      raw: true,
    });

    const ProtectedRoute = ["/profile" ,  "/checkout",  "/todo" , "/recommendation" , "/profile", "/upload", "/users" , "/posts"];
    const AuthRoute = pathname.startsWith("/api/auth");
    const isProtectedRoute = ProtectedRoute.some((route) => {
      return pathname.startsWith(route);
    });

    if (isAuth && pathname.includes("/auth")) {
      return NextResponse.redirect(new URL("/", Request.url));
    }

    if (!isAuth && isProtectedRoute) {
      // Add callback URL to redirect back after signin
      const callbackUrl = encodeURIComponent(Request.url)
      return NextResponse.redirect(new URL(`auth/signin?callbackUrl=${callbackUrl}`, Request.url));
    }

    
    if (isAuth  && pathname.startsWith("/auth")) {
            return NextResponse.redirect(new URL("/", Request.url));

    }

    if (isAuth && AuthRoute) {
      return NextResponse.next();
      // const tokenData = (await jose.jwtVerify(isAuth, jwtConfig.secret)).payload as User;
      // if (!tokenData.isCompleteProfile && pathname !== "/profile" && pathname !== "/" && !pathname.startsWith("/api"))  {
      //   // If profile is not complete, redirect to profile page
      //   return NextResponse.redirect(new URL("/profile", Request.url));
      // } else if (AuthRoute && tokenData.payload.isCompleteProfile  && pathname !== "/") {
      //   // If profile is complete and user is on auth route, redirect to homepage
      //   return NextResponse.redirect(new URL("/", Request.url));
      // }
    } 
  
  },
  {
    callbacks: {
      authorized({ }) {
        // console.log("Authorizedmethotoken"  ,token)
        // console.log("req"  ,JSON.stringify(req))
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)", "/api/auth(.*)"],
};
