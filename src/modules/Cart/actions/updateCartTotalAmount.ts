"use server";

import { Prisma } from "@prisma/client";

import { prisma } from "../../../../prisma/prisma-client";
import { calcCartTotalPrice } from "./calcCartTotalPrice";

/**
 * Updates the total amount of a cart using transaction
 * @param token - Cart token identifier
 * @param tx - Optional transaction client
 * @returns Updated cart with items and products or undefined if cart not found
 */
export const updateCartTotalAmount = async (
  token: string,
  tx?: Prisma.TransactionClient,
) => {
  // Use transaction or make new connection
  const db = tx || prisma;

  // Find the cart with items and products
  const userCart = await db.cart.findFirst({
    where: { token },
    include: {
      items: {
        orderBy: { createdAt: "desc" },
        include: { product: true },
      },
    },
  });
  if (!userCart) return;

  // Calculate total amount
  const totalAmount = userCart.items.reduce(
    (acc, item) => acc + calcCartTotalPrice(item),
    0,
  );

  // Update cart with new total amount
  return db.cart.update({
    where: { id: userCart.id },
    data: { totalAmount },
    include: {
      items: {
        orderBy: { createdAt: "desc" },
        include: { product: true },
      },
    },
  });
};
