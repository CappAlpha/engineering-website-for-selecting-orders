import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { OTP_MAX_ATTEMPTS } from "@/modules/Auth/constants/verified";
import type {
  VerifyRequest,
  VerifyResponse,
} from "@/modules/Auth/entities/verify";
import { hashOtp } from "@/modules/Auth/utils/generateVerificationCode";

import { prisma } from "../../../../../prisma/prisma-client";

export const POST = async (
  req: NextRequest,
): Promise<NextResponse<VerifyResponse>> => {
  const { uid, code } = (await req.json()) as VerifyRequest;

  if (!uid || !code)
    return NextResponse.json<VerifyResponse>(
      { error: "uid/code required" },
      { status: 400 },
    );

  // TODO: clear comments?
  // if (!code) {
  //   return NextResponse.redirect(new URL("/?wrongCode", req.url));
  // }

  const verificationCode = await prisma.verificationCode.findUnique({
    where: { userId: uid },
  });
  if (!verificationCode)
    return NextResponse.json<VerifyResponse>(
      { error: "code not found" },
      { status: 400 },
    );

  if (verificationCode.expiresAt.getTime() < Date.now()) {
    await prisma.verificationCode.delete({ where: { userId: uid } });
    return NextResponse.json<VerifyResponse>(
      { error: "expired" },
      { status: 400 },
    );
  }

  if (verificationCode.attempts >= OTP_MAX_ATTEMPTS) {
    return NextResponse.json<VerifyResponse>(
      { error: "too many attempts" },
      { status: 429 },
    );
  }

  const ok = hashOtp(code) === verificationCode.codeHash;
  if (!ok) {
    await prisma.verificationCode.update({
      where: { userId: uid },
      data: { attempts: { increment: 1 } },
    });
    return NextResponse.json<VerifyResponse>(
      { error: "wrong code" },
      { status: 400 },
    );
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: uid }, data: { verified: new Date() } }),
    prisma.verificationCode.delete({ where: { userId: uid } }),
  ]);

  return NextResponse.json<VerifyResponse>({ ok: true });
};
