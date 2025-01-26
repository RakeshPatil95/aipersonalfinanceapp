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

        // Fetch the budget limit for the user
        const budget = await prisma.budget.findFirst({
            where: { userId: Number(userId) },
            select: { limit: true },
        });

        if (!budget) {
            return NextResponse.json({ budgetLimit: 0 });
        }

        return NextResponse.json({ budgetLimit: budget.limit });
    } catch (error) {
        console.error("Error fetching budget limit:", error);
        return NextResponse.json({
            error: "An unexpected error occurred while fetching the budget limit."
        }, { status: 500 });
    }
}
