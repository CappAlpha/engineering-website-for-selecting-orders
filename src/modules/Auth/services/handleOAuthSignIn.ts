import { hashSync } from "bcrypt";
import { randomUUID } from "crypto";
import { Account, User } from "next-auth";

import { prisma } from "../../../../prisma/prisma-client";
import { mergeCarts } from "./mergeCarts";

export const handleOAuthSignIn = async (
  user: User,
  account: Account | null,
  cartToken: string | undefined,
) => {
  if (!user?.email) {
    console.warn("OAuth login failed: User email is missing");
    return false;
  }

  const provider = account?.provider;
  const providerId = account?.providerAccountId;

  // Ищем существующего пользователя
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ provider, providerId }, { email: user.email }],
    },
    select: {
      id: true,
      provider: true,
      providerId: true,
    },
  });

  let userId;

  if (existingUser) {
    userId = existingUser.id;

    // Обновляем информацию о провайдере, если изменилась
    if (
      existingUser.provider !== provider ||
      existingUser.providerId !== providerId
    ) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          provider,
          providerId,
          updatedAt: new Date(),
        },
      });
    }

    // Объединяем корзины для существующего пользователя
    if (cartToken) {
      await mergeCarts(cartToken, userId);
    }
  } else {
    // Создаем нового пользователя
    const newUser = await prisma.user.create({
      data: {
        id: randomUUID(),
        fullName: user.name ?? `User ${randomUUID().substring(0, 8)}`,
        email: user.email,
        password: hashSync(randomUUID(), 12),
        verified: new Date(),
        provider,
        providerId,
        createdAt: new Date(),
      },
    });

    // Объединяем корзины для нового пользователя
    if (cartToken && newUser?.id) {
      await mergeCarts(cartToken, newUser.id);
    }
  }

  return true;
};
