

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import authConfig from "./auth.config";

const prisma = new PrismaClient();

// Initialize NextAuth with the Prisma adapter and session strategy
export const { auth, handlers, signIn, signOut } = NextAuth({
  // adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  ...authConfig,
});
