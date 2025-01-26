import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Fetch recent expenses
    const expenses = await prisma.expense.findMany({
      where: {
        userId: Number(userId),
      },
      select: {
        id: true,
        amount: true,
        description: true,
        date: true,
      },
      orderBy: {
        date: 'desc'
      },
      take: 5  // Changed from 10 to 5
    });

    // Calculate total spent
    const totalSpent = await prisma.expense.aggregate({
      where: {
        userId: Number(userId),
      },
      _sum: {
        amount: true,
      },
    });

    return NextResponse.json({
      expenses,
      totalSpent: totalSpent._sum.amount || 0
    });
  } catch (error) {
    console.error("Error fetching recent expenses:", error);
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
  }
} 