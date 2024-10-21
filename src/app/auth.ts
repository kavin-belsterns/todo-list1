

import NextAuth from "next-auth";
import authConfig from "./auth.config";


// Initialize NextAuth with the Prisma adapter and session strategy
export const { auth, handlers, signIn, signOut } = NextAuth({
  // adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  ...authConfig,
});
