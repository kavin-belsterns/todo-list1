import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const verifyUser = async (credentials: { email: string; password: string }) => {
  const { email, password } = credentials;

  // Find the user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Check if user exists and verify password
  if (user && (await bcrypt.compare(password, user.password))) {
    // Return user data (exclude password)
    const { password: _, ...userData } = user;
    return userData; // Return user without password
  }

  return null; // Return null if user not found or password incorrect
};
