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

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { income: true },
    });

    if (!user) {
        return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }

    return NextResponse.json({ salary: user.income });
  } catch (error) {
    console.error("Error fetching salary:", error);
    return NextResponse.json({ error: "An unexpected error occurred while fetching salary." }, { status: 500 });
  }
}
