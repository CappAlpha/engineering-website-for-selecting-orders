import { NextRequest, NextResponse } from "next/server";

import { prisma } from "../../../../prisma/prisma-client";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("query") ?? "";
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch search products" },
      { status: 500 },
    );
  }
}
