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

  if (!provider || !providerId) {
    console.warn("OAuth login failed: provider/providerId is missing");
    return false;
  }

  // Search for an existing user
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ provider, providerId }, { email: user.email }],
    },
    select: {
      id: true,
      provider: true,
      providerId: true,
      verified: true,
    },
  });

  if (existingUser) {
    const userId = existingUser.id;

    if (existingUser.provider && existingUser.provider !== provider) {
      console.warn(
        `OAuth login blocked: user already linked to provider=${existingUser.provider}`,
      );
      return false;
    }

    const shouldUpdateProvider =
      existingUser.provider !== provider ||
      existingUser.providerId !== providerId;

    const shouldSetVerified = !existingUser.verified;

    await prisma.$transaction([
      ...(shouldUpdateProvider || shouldSetVerified
        ? [
            prisma.user.update({
              where: { id: userId },
              data: {
                ...(shouldUpdateProvider ? { provider, providerId } : {}),
                ...(shouldSetVerified ? { verified: new Date() } : {}),
              },
            }),
          ]
        : []),

      // if user was local+unverified and has verification code - clearing
      ...(shouldSetVerified
        ? [prisma.verificationCode.deleteMany({ where: { userId } })]
        : []),
    ]);

    if (cartToken) {
      await mergeCarts(cartToken, userId);
    }

    return true;
  }

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

  return true;
};
