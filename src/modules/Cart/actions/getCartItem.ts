"use server";

import { Prisma, CartItem } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "../../../../prisma/prisma-client";

/**
 * Finds a cart item by its ID.
 * @param id - The ID of the cart item to find
 * @returns The cart item if found, otherwise a 404 response
 */
export const getCartItem = async (
  id: number,
  tx?: Prisma.TransactionClient,
): Promise<CartItem | NextResponse> => {
  // Use transaction or make new connection
  const db = tx || prisma;

  const cartItem = await db.cartItem.findUnique({
    where: {
      id,
    },
  });

  if (!cartItem) {
    return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  }

  return cartItem;
};
