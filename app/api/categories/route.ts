import { NextResponse } from "next/server";
import { prisma } from "../../../prisma/prisma-client";

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  }
  catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}