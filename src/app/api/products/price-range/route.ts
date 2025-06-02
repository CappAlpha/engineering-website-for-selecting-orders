import { NextResponse } from "next/server";

import { prisma } from "../../../../../prisma/prisma-client";

export async function GET() {
  try {
    const result = await prisma.product.aggregate({
      _min: {
        price: true,
      },
      _max: {
        price: true,
      },
    });

    const minPrice = result._min.price ?? 0;
    const maxPrice = result._max.price ?? 100000;

    return NextResponse.json({
      minPrice,
      maxPrice,
    });
  } catch (error) {
    console.error("Error fetching price range:", error);
    return NextResponse.json(
      { message: "[GET_PRICE_RANGE] error" },
      { status: 500 },
    );
  }
}
