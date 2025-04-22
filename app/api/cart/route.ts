import { NextRequest, NextResponse } from "next/server";

import { prisma } from "../../../prisma/prisma-client";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("cartToken")?.value;
    const defaultResponse = { totalAmount: 0, items: [] };

    if (!token) {
      return NextResponse.json(defaultResponse);
    }

    const userCart = await prisma.cart.findFirst({
      where: {
        OR: [
          {
            token,
          },
        ],
      },
      include: {
        items: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(userCart ?? defaultResponse);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 },
    );
  }
}
