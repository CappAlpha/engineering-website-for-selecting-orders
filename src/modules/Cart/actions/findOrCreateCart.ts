import { Cart } from "@prisma/client";

import { prisma } from "../../../../prisma/prisma-client";

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
