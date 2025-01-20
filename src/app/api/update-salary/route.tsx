// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import { getServerSession } from "next-auth"; // Import getServerSession from next-auth
// import { authOptions } from "@/app/api/auth/[...nextauth]";  // Adjust the import path as needed

// const prisma = new PrismaClient();

// export async function POST(req: Request) {
//   // Get the session from the request
//   const session = await getServerSession(authOptions);

//   // Check if there is no session or the user is not authenticated
//   if (!session || !session.user || !session.user.id) {
//     return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//   }

//   // Parse the request body
//   const { salary } = await req.json();

//   // Update the user's salary in the database using the session user ID
//   const updatedUser = await prisma.user.update({
//     where: { id: parseInt(session.user.id) }, // Ensure the user ID is parsed as an integer
//     data: { income: salary },
//   });

//   // Return the updated salary
//   return NextResponse.json({ salary: updatedUser.income });
// }

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Parse and log the request body
    const body = await req.json();

    // Ensure the body is not null and contains salary
    if (!body || body.salary === undefined) {
      return NextResponse.json({ error: "Missing salary in request" }, { status: 400 });
    }

    let { salary } = body;

    // Parse salary to a number
    salary = Number(salary);

    // Validate salary as a number
    if (isNaN(salary) || salary <= 0) {
      return NextResponse.json({ error: "Invalid salary value" }, { status: 400 });
    }

    // Update the user's salary
    const updatedUser = await prisma.user.update({
      where: { id: 2 }, // Use dynamic user ID if necessary
      data: { income: salary }, // Use the validated and parsed salary
    });

    return NextResponse.json({ salary: updatedUser.income });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to update salary" }, { status: 500 });
  }
}

