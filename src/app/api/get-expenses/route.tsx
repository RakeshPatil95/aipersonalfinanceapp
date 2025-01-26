// pages/api/get-expenses.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // Parse userId from the query parameters
    const { searchParams } = new URL(req.url || "");
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Fetch all expenses for the user
    const expenses = await prisma.expense.findMany({
      where: {
        userId: Number(userId),
      },
      select: {
        id: true,
        amount: true,
        description: true,
        date: true, // Include the date if stored in the database
      },
      orderBy: {
        date: "desc", // Sort expenses by most recent
      },
    });

    // Calculate the total expenses for the user
    const totalExpenses = await prisma.expense.aggregate({
      where: { userId: Number(userId) },
      _sum: {
        amount: true,
      },
    });

    return NextResponse.json({
      expenses,
      totalExpenses: totalExpenses._sum.amount || 0, // Return 0 if no expenses
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
  }
}
