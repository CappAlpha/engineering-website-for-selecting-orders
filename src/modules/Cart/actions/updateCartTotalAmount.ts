"use server";

import { prisma } from "../../../../prisma/prisma-client";
import { calcCartTotalPrice } from "./calcCartTotalPrice";

/**
 * Updates the total amount of a cart by calculating the sum of all items
 * @param token - Cart token identifier
 * @returns Updated cart with items and products or undefined if cart not found
 */
export const updateCartTotalAmount = async (token: string) => {
  // Find the cart with items and products
  const userCart = await prisma.cart.findFirst({
    where: {
      token,
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

  if (!userCart) {
    return;
  }

  // Calculate total amount using reduce
  const totalAmount = userCart.items.reduce((acc, item) => {
    return acc + calcCartTotalPrice(item);
  }, 0);

  // Update cart with new total amount
  const updateCart = await prisma.cart.update({
    where: {
      id: userCart.id,
    },
    data: {
      totalAmount,
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

  return updateCart;
};
