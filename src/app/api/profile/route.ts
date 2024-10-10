import { getToken } from 'next-auth/jwt'; // Assuming you're using NextAuth
import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(req: Request) {
  try {
    const token = await getToken({ req,secret: process.env.NEXTAUTH_SECRET }); // Decode JWT from request

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = token.sub; // Ensure 'sub' holds the user ID

    // Fetch user data
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) }, // Fetch the user using their ID
      select: {
        email: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user info
    return NextResponse.json({ email: user.email, name: user.name });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
