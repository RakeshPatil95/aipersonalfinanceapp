/** @format */

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        // Parse userId from the query parameters
        const { searchParams } = new URL(req.url || "");
        const userId = searchParams.get("userId");
    
        if (!userId) {
          return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

    // Fetch the user's income
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        income: true,
        expenses: {
          select: {
            amount: true,
            date: true,
          },
        },
      },
    });

    if (!user) {
        return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }

    const { income, expenses } = user;

    // Group expenses by month and calculate monthly totals
    const monthlyExpenses: { [key: string]: number } = {};
    expenses.forEach((expense) => {
      const monthKey = `${expense.date.getFullYear()}-${expense.date.getMonth() + 1}`;
      monthlyExpenses[monthKey] = (monthlyExpenses[monthKey] || 0) + expense.amount;
    });

    // Calculate total savings by subtracting monthly expenses from income
    const totalSavings = Object.values(monthlyExpenses).reduce(
      (total, monthlyExpense) => total + (income - monthlyExpense),
      0
    );

    return NextResponse.json({
         savings: totalSavings 
    })
  } catch (error) {
    console.error("Error fetching savings:", error);
    return NextResponse.json({ error: "An unexpected error occurred while fetching savings." }, { status: 500 });
  }
}
