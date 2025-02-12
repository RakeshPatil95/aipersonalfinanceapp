/** @format */

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

    const goal = await prisma.goal.findFirst({
      where: { userId: Number(userId) },
      select: {
        amount: true,
        description: true,
        targetDate: true,
      },
    });
    if (!goal) {
      return NextResponse.json({ goalAmount: 0, goalDescription: "", targetDate: "" });
    }

    return NextResponse.json({
      goalAmount: goal.amount,
      goalDescription: goal.description,
      targetDate: goal.targetDate.toISOString(), // Send target date in a standardized format
    });
  } catch (error) {
    console.error("Error fetching goal:", error);
    return NextResponse.json({
      error: "An unexpected error occurred while fetching the goal."
    }, { status: 500 });
  }
}
