import { NextResponse } from "next/server";

import { prisma } from "../../../prisma/prisma-client";

export async function GET() {
  try {
    const tags = await prisma.product.findMany({
      select: { tags: true },
    });
    const uniqueTags = [...new Set(tags.flatMap((item) => item.tags))];
    return NextResponse.json(uniqueTags);
  } catch (error) {
    console.error("[TAGS_GET] API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 },
    );
  }
}
