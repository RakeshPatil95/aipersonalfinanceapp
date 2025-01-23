import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        // Parse the request body
        let { userId, limit } = await req.json();

        // Validate the inputs
        if (!userId || isNaN(userId)) {
            return NextResponse.json({ error: "Invalid or missing userId" }, { status: 400 });
        }

        if (isNaN(limit) || limit <= 0) {
            return NextResponse.json({ error: "Invalid budget limit value" }, { status: 400 });
        }

        userId = Number(userId);
        limit = Number(limit);

        // Update the budget's limit for the specified user
        const updatedBudget = await prisma.budget.create({
            data: {
                limit: limit,
                category: "savings for future",
                user:{
                    connect:{
                        id: userId
                    },
                },
            },
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
