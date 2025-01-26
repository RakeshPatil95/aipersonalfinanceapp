// pages/api/add-expense.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function POST(req: Request) {
  if (req.method === "POST") {
    try {
      const { userId, amount, description } = await req.json();

      if (!userId || !amount || !description) {
        return NextResponse.json({ error: "Invalid or missing fields" }, { status: 400 });
      }

      // Create the new expense
      const newExpense = await prisma.expense.create({
        data: {
          userId: Number(userId),
          amount: Number(amount),
          description,
        },
      });

      // Get the total expenses for the user
      const totalExpenses = await prisma.expense.aggregate({
        where: { userId: Number(userId) },
        _sum: {
          amount: true,
        },
      });

      return NextResponse.json({ 
        expense: newExpense,
        totalExpenses: totalExpenses._sum.amount 
      });
    } catch (error) {
      console.error("Error adding expense:", error);
      return NextResponse.json({ error: "Failed to add expense" }, { status: 500 });
    }
  } 
}
