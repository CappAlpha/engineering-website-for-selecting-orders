import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createElement } from "react";

import { OTP_RESEND_COOLDOWN_SECONDS } from "@/modules/Auth/constants/verified";
import type {
  ResendRequest,
  ResendResponse,
} from "@/modules/Auth/entities/verify";
import { EmailVerification } from "@/modules/Auth/ui/EmailVerification";
import {
  generateOtp,
  getOtpExpiresAt,
  hashOtp,
} from "@/modules/Auth/utils/generateVerificationCode";
import { sendEmail } from "@/modules/Order/services/sendEmail";

import { prisma } from "../../../../../prisma/prisma-client";

export const POST = async (
  req: NextRequest,
): Promise<NextResponse<ResendResponse>> => {
  const { uid } = (await req.json()) as ResendRequest;

  if (!uid) {
    return NextResponse.json<ResendResponse>(
      { error: "uid required" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { id: uid } });
  if (!user) {
    return NextResponse.json<ResendResponse>(
      { error: "user not found" },
      { status: 404 },
    );
  }

  if (user.verified) {
    return NextResponse.json<ResendResponse>(
      { error: "already verified" },
      { status: 400 },
    );
  }

  const existing = await prisma.verificationCode.findUnique({
    where: { userId: uid },
  });

  if (existing?.lastSentAt) {
    const diffMs = Date.now() - existing.lastSentAt.getTime();
    if (diffMs < OTP_RESEND_COOLDOWN_SECONDS * 1000) {
      return NextResponse.json<ResendResponse>(
        { error: `wait ${OTP_RESEND_COOLDOWN_SECONDS}s` },
        { status: 429 },
      );
    }
  }

  const code = generateOtp();
  const codeHash = hashOtp(code);
  const expiresAt = getOtpExpiresAt();

  await prisma.verificationCode.upsert({
    where: { userId: uid },
    update: {
      codeHash,
      expiresAt,
      attempts: 0,
      lastSentAt: new Date(),
    },
    create: {
      userId: uid,
      codeHash,
      expiresAt,
      attempts: 0,
      lastSentAt: new Date(),
    },
  });

  const emailElement = createElement(EmailVerification, {
    code,
    ttlMinutes: 10,
  });

  await sendEmail(user.email, "Engineer / Код подтверждения", emailElement);

  return NextResponse.json<ResendResponse>({ ok: true });
};
