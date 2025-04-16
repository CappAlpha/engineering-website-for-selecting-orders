import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../prisma/prisma-client";

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // TODO: add error catch
  const data = await req.json();

  const user = await prisma.user.create({
    data,
  });

  return NextResponse.json(user);
}
