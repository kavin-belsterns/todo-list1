// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// // import { PrismaAdapter } from "@auth/prisma-adapter";

// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();



//  export const { handlers, signIn, signOut, auth }= NextAuth({
//   // adapter: PrismaAdapter(prisma),
//     providers: [
//       CredentialsProvider({
//         name: "Credentials",
//         credentials: {
//           email: { placeholder: "Email", type: "text" },
//           password: { placeholder: "Password", type: "password" },
//         },
//         async authorize(credentials) {
//           if (!credentials?.email || !credentials?.password) {
//             throw new Error("Email and password are required");
//           }

//           const user = await prisma.user.findUnique({
//             where: { email: credentials.email as string },
//           });

//           if (!user || !(await bcrypt.compare(credentials.password as string, user.password))) {
//             throw new Error("Invalid email or password");
//           }

//           return {
//             id: String(user.id), // Convert id to string
//             name: user.name,
//             email: user.email,
//             role:user.role,
//           };
//         },
//       }),
//     ],
//     session:{
//         strategy: 'jwt',
        
//         maxAge:24*60*60
//     },
//     secret:process.env.NEXTAUTH_SECRET,
//     pages: {
//       signIn: "/home", 
//     },
//   });


  // auth.ts

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import authConfig from "./auth.config";

const prisma = new PrismaClient();

// Initialize NextAuth with the Prisma adapter and session strategy
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  ...authConfig,
});
