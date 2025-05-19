import { Cart } from "@prisma/client";

import { prisma } from "../../../../prisma/prisma-client";

/**
 * Finds an existing cart by token or creates a new one if not found.
 * @param token - The unique token identifying the cart
 * @returns The cart associated with the provided token
 */
export const findOrCreateCart = async (token: string): Promise<Cart> => {
  const userCart =
    (await prisma.cart.findFirst({
      where: {
        token,
      },
    })) ??
    (await prisma.cart.create({
      data: {
        token,
      },
    }));

  return userCart;
};
