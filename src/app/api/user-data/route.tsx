import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'; // Import PrismaClient

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function GET() {
  const user = await prisma.user.findUnique({
    where: { id: 2 }, // Replace with dynamic user ID
    include: { budgets: true },
  });

  return NextResponse.json({
    salary: user?.income || 0,
    budgetLimit: user?.budgets[0]?.limit || 0, // Assuming one budget per user
  });
}
