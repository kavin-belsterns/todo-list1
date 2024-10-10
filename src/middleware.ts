import { getToken } from "next-auth/jwt";
// import { auth } from "./app/auth";
import authConfig from "./app/auth.config";
import { NextResponse } from "next/server";
import NextAuth from "next-auth";
const publicRoutes=["/login","/register"]
const authRoutes = ["/home","/profile"]
const { auth } = NextAuth(authConfig);
export default auth(async(req) => {
    const { nextUrl } = req;
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const isLoggedIn = !!req.auth;
    // const isLoggedIn=!!token;
    // console.log(nextUrl)
    console.log(req.auth)
   
    const role = (req.auth?.user as any)?.role;
    console.log(role)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    // const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname);
    // if(isProtectedRoute && role !== 'admin') {
    //   return;
    // }
//    console.log(isAuthRoute)
     if (isLoggedIn && isPublicRoute) {

        return NextResponse.redirect(new URL("/home", req.url));
      }
   
    // if (isAuthRoute && !isLoggedIn) {
    // //   return NextResponse.next();
    // return NextResponse.redirect(new URL("/login", req.url));
    // }
   
    if (!isLoggedIn && !isPublicRoute) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  
    return NextResponse.next();
  });

   
  export const config = {
    matcher: ['/login','/home','/profile','/register']
  };
   
   
 