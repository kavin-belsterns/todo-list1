

import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig, Session } from "next-auth";
import {JWT} from 'next-auth/jwt'
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// interface CustomToken extends JWT {
//   role: string; // Add role to the token
// }

// // interface CustomSession extends Session {
// //   user: {
// //     role: string; // Add role to the user object in the session
// //   };
// // }



// declare module "next-auth/jwt" {
//   interface JWT {
//     role: string; // Add role to the JWT interface
//   }
// }



declare module "next-auth" {
  interface User {
    role: string; // Add role to the User interface
  }

  interface Session {
    user: {
      role: string; // Add role to the Session interface
    } ;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string; // Add role to the JWT interface
  }
}


const authConfig: NextAuthConfig = {
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
          role: user.role, // Return user role
            
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log(user)
        // Add the role to the JWT token
        token.role = user.role; // Add the user's role to the token
      }
      return token; // Close jwt function
    },
    async session({ session, token }) {
      if (token) {
        // Make the role available in the session
        session.user.role = token.role as string; // Add the role to the session user
      }
      return session; // Close session function
    },
  },
  pages: {
    signIn: "/home",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authConfig;
