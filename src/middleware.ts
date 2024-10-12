import { getToken } from "next-auth/jwt";
// import { auth } from "./app/auth";
import authConfig from "./app/auth.config";
import { NextResponse } from "next/server";
import NextAuth from "next-auth";
const publicRoutes=["/login","/register"]
const authRoutes = ["/home","/profile"]
const adminRoute=["/admin/home"]
const { auth } = NextAuth(authConfig);

export default auth(async(req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

   
    const role = (req.auth?.user as any)?.role;
    console.log(role)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isAdminRoute=adminRoute.includes(nextUrl.pathname);
    if(isLoggedIn && isPublicRoute && role === 'ADMIN') {
      
      return NextResponse.redirect(new URL("/admin/home", req.url));
    }
    if(isLoggedIn && isAuthRoute && role === 'ADMIN') {
      
      return NextResponse.redirect(new URL("/admin/home", req.url));
    }
//    console.log(isAuthRoute)
     if (isLoggedIn && isPublicRoute && role !== 'ADMIN') {

        return NextResponse.redirect(new URL("/home", req.url));
      }
   
    // if (isAuthRoute && !isLoggedIn) {
    // //   return NextResponse.next();
    // return NextResponse.redirect(new URL("/login", req.url));
    // }

   
    if (!isLoggedIn && !isPublicRoute ) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  
    return NextResponse.next();
  });

   
  export const config = {
    matcher: ['/login','/home','/profile','/register','/admin/home']
  };
   
   
 