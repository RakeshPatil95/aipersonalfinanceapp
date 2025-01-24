/** @format */

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Parse incoming data
    let { userId, goalAmount, goalDescription, targetDate } = await req.json();

    // Validate the incoming data
    if (!userId || !goalAmount || !goalDescription || !targetDate) {
      return NextResponse.json({ error: "Invalid or missing userId" }, { status: 400 });
    }

    userId = Number(userId);
    goalAmount = Number(goalAmount);

    // Try to find an existing goal for the user
    const existingGoal = await prisma.goal.findFirst({
      where: { userId: userId },
    });

    let goal;

    if (existingGoal) {
      // If a goal exists, update it
      goal = await prisma.goal.update({
        where: { id: existingGoal.id },
        data: {
          amount: goalAmount,
          description: goalDescription,
          targetDate: new Date(targetDate),
        },
      });
    } else {
      // If no goal exists, create a new one
      goal = await prisma.goal.create({
        data: {
          amount: goalAmount,
          description: goalDescription,
          targetDate: new Date(targetDate),
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }

    return NextResponse.json({ amount: goal.amount });
  } catch (error) {
    console.error("Error setting goal:", error);
    return NextResponse.json({ error: "Failed to set or update goal" }, { status: 500 });
  }
}
