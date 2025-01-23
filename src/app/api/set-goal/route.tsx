// pages/api/set-goal.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// Initialize Prisma Client
const prisma = new PrismaClient();
export async function POST(req: Request) {
    try {
      let { userId, goalAmount, goalDescription, targetDate } =await req.json();

      // Validate the incoming data
      if (!userId || !goalAmount || !goalDescription || !targetDate) {
        return NextResponse.json({ error: "Invalid or missing userId" }, { status: 400 });
      }

      userId = Number(userId);
      goalAmount = Number(goalAmount);

      // Create the goal in the database
      const goal = await prisma.goal.create({
        data: {
          amount: goalAmount,
          description: goalDescription,
          targetDate: new Date(targetDate),
          user:{
            connect:{
              id: userId
            }
          }
        },
      });

      return NextResponse.json({ amount: goal.amount });
    } catch (error) {
      console.error("Error creating goal:", error);
      return NextResponse.json({ error: "Failed to set goal" }, { status: 500 });
    }
}
