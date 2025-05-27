import { setCartCookie } from "@/shared/lib/setCartToken";

import { prisma } from "../../../../prisma/prisma-client";

export const handleUserCart = async (
  userId: string,
  userEmail: string,
  isCredentials: boolean,
) => {
  if (!userId && !userEmail) return;

  // Retrieve the user's existing shopping cart
  const userCart = await prisma.user.findUnique({
    where: isCredentials ? { id: userId } : { email: userEmail },
    select: {
      cart: {
        select: {
          token: true,
        },
      },
    },
  });

  const token = userCart?.cart?.token;

  // If the user has a shopping cart, set a cookie
  if (token) {
    await setCartCookie(token);
  }
};
