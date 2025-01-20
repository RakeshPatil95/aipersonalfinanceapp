import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { limit } = await req.json();

    // Validate the input
    if (isNaN(limit) || limit <= 0) {
      return NextResponse.json({ error: "Invalid budget limit value" }, { status: 400 });
    }

    // Update the budget's limit in the budget table
    const updatedBudget = await prisma.budget.update({
      where: { userId: 1 }, // Replace with dynamic user ID if necessary
      data: { limit },
    });

    // Return the updated budget limit
    return NextResponse.json({ budgetLimit: updatedBudget.limit });
  } catch (error) {
    console.error("Error updating budget limit:", error);
    return NextResponse.json(
      { error: "Failed to update budget limit" },
      { status: 500 }
    );
  }
}
