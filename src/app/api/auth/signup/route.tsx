import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// Initialize Prisma Client
const prisma = new PrismaClient();

console.log("API: /auth/signup -  Rakesh");

// POST method for user signup
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);
    const { name, email, password } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        income: 0, // Default income value, adjust as necessary
      },
    });

    return NextResponse.json({ message: "User created successfully", user }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
