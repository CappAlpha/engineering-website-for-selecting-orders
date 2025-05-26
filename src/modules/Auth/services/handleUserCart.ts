import { setCartCookie } from "@/shared/lib/setCartToken";

import { prisma } from "../../../../prisma/prisma-client";

export const handleUserCart = async (userId: string) => {
  if (!userId) return;

  // Получаем существующую корзину пользователя
  const userCart = await prisma.cart.findFirst({
    where: { userId },
    select: { token: true },
  });

  // Если у пользователя есть корзина, устанавливаем cookie
  if (userCart?.token) {
    await setCartCookie(userCart.token);
  }
};
