import { CartItem } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "../../../../prisma/prisma-client";

/**
 * Finds a cart item by its ID.
 * @param id - The ID of the cart item to find
 * @returns The cart item if found, otherwise a 500 response
 */
export const getCartItem = async (
  id: number,
): Promise<CartItem | NextResponse> => {
  const cartItem = await prisma.cartItem.findUnique({
    where: {
      id,
    },
  });

  if (!cartItem) {
    return NextResponse.json({ error: "Cart item not found" }, { status: 500 });
  }

  return cartItem;
};
