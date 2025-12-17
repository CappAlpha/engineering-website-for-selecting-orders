import { hashSync } from "bcrypt";
import type { Account, User } from "next-auth";
import { randomUUID } from "node:crypto";

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

  // Search for an existing user
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

  if (existingUser) {
    const userId = existingUser.id;

    // Update the provider information if it has changed
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

    // Merge baskets for an existing user
    if (cartToken) {
      await mergeCarts(cartToken, userId);
    }
  } else {
    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        fullName: user.name ?? `User ${randomUUID().substring(0, 8)}`,
        email: user.email,
        password: hashSync(randomUUID(), 12),
        verified: new Date(),
        provider,
        providerId,
        createdAt: new Date(),
      },
      select: {
        id: true,
      },
    });

    // Merge shopping carts for a new user
    if (cartToken) {
      await mergeCarts(cartToken, newUser.id);
    }
  }

  return true;
};
