import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'; // Import PrismaClient

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { amount, description } = await req.json();
  const expense = await prisma.expense.create({
    data: {
      amount,
      description,
      userId: 1, // Replace with dynamic user ID
    },
  });

  return NextResponse.json(expense);
}
