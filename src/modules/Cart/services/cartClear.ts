import { Cart } from "@prisma/client";

import { prisma } from "../../../../prisma/prisma-client";

export const cartClear = async (userCart: Cart) => {
  await prisma.cart.update({
    where: {
      id: userCart.id,
    },
    data: {
      totalAmount: 0,
    },
  });
  await prisma.cartItem.deleteMany({
    where: {
      cartId: userCart.id,
    },
  });
};
