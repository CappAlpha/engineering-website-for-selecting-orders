import { Cart } from "@prisma/client";

import { prisma } from "../../../../prisma/prisma-client";

/**
 * Finds an existing cart by token or creates a new one if not found.
 * @param token - The unique token identifying the cart
 * @returns The cart associated with the provided token
 */
export const findOrCreateCart = async (
  token: string,
  userId?: string,
): Promise<Cart> => {
  // If user is logged in, try to find their cart first
  if (userId) {
    const userCart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (userCart) return userCart;
  }

  // Try to find cart by token
  const tokenCart = await prisma.cart.findFirst({
    where: { token },
  });

  if (tokenCart) {
    // If user is logged in but cart isn't associated yet, associate it
    if (userId && !tokenCart.userId) {
      return prisma.cart.update({
        where: { id: tokenCart.id },
        data: { userId },
      });
    }
    return tokenCart;
  }

  // Create new cart (with userId if available)
  return await prisma.cart.create({
    data: {
      token,
      userId: userId ?? undefined,
    },
  });
};
