import { prisma } from "../../../../prisma/prisma-client";
import { UNVERIFIED_USER_TTL_HOURS } from "../constants/verified";

export async function cleanupStaleUnverifiedUsers(): Promise<{
  deleted: number;
}> {
  const now = new Date();
  const threshold = new Date(
    now.getTime() - UNVERIFIED_USER_TTL_HOURS * 60 * 60 * 1000,
  );

  const res = await prisma.user.deleteMany({
    where: {
      verified: null,
      createdAt: { lt: threshold },

      provider: null,
      providerId: null,

      OR: [
        { verificationCode: { is: null } },
        { verificationCode: { is: { expiresAt: { lt: now } } } },
      ],

      orders: { none: {} },
    },
  });

  return { deleted: res.count };
}
