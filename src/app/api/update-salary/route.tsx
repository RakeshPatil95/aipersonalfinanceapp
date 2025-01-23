import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    console.log(req.body + 'reqest rec');
  try {
    // Parse and log the request body
    const body = await req.json();

    // Ensure the body contains userId and salary
    if (!body || body.userId === undefined || body.salary === undefined) {
      return NextResponse.json({ error: "Missing userId or salary in request" }, { status: 400 });
    }

    let { userId, salary } = body;

    // Parse salary to a number
    salary = Number(salary);
    userId = Number(userId);

    // Validate salary as a number
    if (isNaN(salary) || salary <= 0) {
      return NextResponse.json({ error: "Invalid salary value" }, { status: 400 });
    }

    // Update the user's salary
    const updatedUser = await prisma.user.update({
      where: { id: userId }, // Use dynamic userId from the request body
      data: { income: salary }, // Use the validated and parsed salary
    });

    return NextResponse.json({ salary: updatedUser.income });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to update salary" }, { status: 500 });
  }
}
