

import NextAuth from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/home", "/profile"];

async function middleware(req: NextRequest) {
  
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;
  console.log(token)
  console.log(pathname)

  if (pathname === "/login" && token) {
    // If user is authenticated, prevent them from accessing the login page
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (protectedRoutes.includes(pathname) && !token) {
    // If user is not authenticated and tries to access protected routes, redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/login","/home","/profile"], 
};
