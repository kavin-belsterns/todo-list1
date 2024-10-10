// auth.config.ts

import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { placeholder: "Email", type: "text" },
        password: { placeholder: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !(await bcrypt.compare(credentials.password as string, user.password))) {
          throw new Error("Invalid email or password");
        }

        return {
          id: String(user.id), // Convert id to string
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         // Add the role to the JWT token
//         token.role = user?.role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         // Make the role available in the session
//         session.user.role = token.role;
//       }
//       return session;
//     },
//   },
  pages: {
    signIn: "/home", 
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

export default authConfig;
