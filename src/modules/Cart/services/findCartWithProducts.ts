import { prisma } from "../../../../prisma/prisma-client";

export const findCartWithProducts = async (cartToken: string) => {
  const userCart = await prisma.cart.findFirst({
    where: {
      token: cartToken,
    },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return userCart;
};
