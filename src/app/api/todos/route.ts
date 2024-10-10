

import {getToken} from "next-auth/jwt"
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const token: any = await getToken({ req: request,secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
console.log(token)
    const { title, description } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    const userid=Number(token?.sub )
    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        userId: userid, // Link todo to the authenticated user
      },
    });

    return NextResponse.json(
      {
        message: 'Todo added successfully',
        todo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to add todo item' },
      { status: 500 }
    );
  }
}

// GET method to fetch all todo items for the current user
export async function GET(request: Request) {
  try {
    const token: any = await getToken({ req: request,secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userid=Number(token?.sub )
    const todos = await prisma.todo.findMany({
      where: { userId: userid }, // Fetch only todos for the authenticated user
    });

    return NextResponse.json(
      {
        message: 'Todos retrieved successfully',
        todos,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Message: ", error); 
    return NextResponse.json(
      { error: 'Failed to fetch todo items' },
      { status: 500 }
    );
  }
}

// PATCH method to update a todo item for the current user
export async function PATCH(request: Request) {
  try {
    const token: any = await getToken({ req: request ,secret: process.env.NEXTAUTH_SECRET});

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userid=Number(token?.sub )
    const { id, title, description, isDone } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Todo ID is required' }, { status: 400 });
    }

    const existingTodo = await prisma.todo.findUnique({
      where: { id: Number(id), userId: userid }, 
    });

    if (!existingTodo) {
      return NextResponse.json({ error: 'Todo not found or unauthorized' }, { status: 404 });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        isDone,
      },
    });

    return NextResponse.json(
      {
        message: 'Todo updated successfully',
        todo: updatedTodo,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update todo item' },
      { status: 500 }
    );
  }
}

// DELETE method to remove a todo item for the current user
export async function DELETE(request: Request) {
  try {
    const token: any = await getToken({ req: request,secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Todo ID is required' }, { status: 400 });
    }
    const userid=Number(token?.sub )
    const existingTodo = await prisma.todo.findUnique({
      where: { id: Number(id), userId: userid}, 
    });

    if (!existingTodo) {
      return NextResponse.json({ error: 'Todo not found or unauthorized' }, { status: 404 });
    }

    await prisma.todo.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: 'Todo deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete todo item' },
      { status: 500 }
    );
  }
}
