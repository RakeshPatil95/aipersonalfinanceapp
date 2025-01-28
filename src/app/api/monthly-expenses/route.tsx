import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function GET(req: Request) {
    if (req.method !== "GET") {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }

    const { searchParams } = new URL(req.url || "");
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    try {
        const expenses = await prisma.expense.findMany({
            where: {
                userId: parseInt(userId as string, 10),
            },
            select: {
                amount: true,
                date: true,
            },
        });

        // Initialize months with 0
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const monthlyExpenses = months.map((month) => ({
            name: month,
            total: 0,
        }));

        // Calculate total for each month
        expenses.forEach((expense) => {
            const monthIndex = new Date(expense.date).getMonth();
            monthlyExpenses[monthIndex].total += expense.amount;
        });

        return NextResponse.json(monthlyExpenses, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
