import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password, name } = await req.json(); // Use req.json() for parsing

  // Input validation
  if (!email || !password || !name) {
    return new Response(JSON.stringify({ message: "All fields are required." }), { status: 400 });
  }

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists." }), { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    const { password: _, ...userResponse } = user; 

    return new Response(JSON.stringify({ message: "User registered successfully", userResponse }), { status: 201 });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error creating user:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects after the request
  }
}
