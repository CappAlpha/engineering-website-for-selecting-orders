import { setCartCookie } from "@/shared/lib/setCartToken";

import { prisma } from "../../../../prisma/prisma-client";

export const handleUserCart = async (userId: string) => {
  if (!userId) return;

  // Retrieve the user's existing shopping cart
  const userCart = await prisma.cart.findFirst({
    where: { userId },
    select: { token: true },
  });

  // If the user has a shopping cart, set a cookie
  if (userCart?.token) {
    await setCartCookie(userCart.token);
  }
};
