import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { prisma } from "../../../../../prisma/prisma-client";

export const GET = async (req: NextRequest) => {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    console.error("[VERIFY_GET] Verification code not found in url");
    return NextResponse.redirect(new URL("/?wrongCode", req.url));
  }

  try {
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        code,
      },
    });

    if (!verificationCode) {
      console.error("[VERIFY_GET] Verification code not found");
      return NextResponse.redirect(new URL("/?wrongCode", req.url));
    }

    await prisma.user.update({
      where: {
        id: verificationCode.userId,
      },
      data: {
        verified: new Date(),
      },
    });

    await prisma.verificationCode.delete({
      where: {
        id: verificationCode.id,
      },
    });

    return NextResponse.redirect(new URL("/?verified", req.url));
  } catch (err) {
    console.error("[VERIFY_GET] API error:", err);
    return NextResponse.json(
      { error: "Failed to get verify code" },
      { status: 500 },
    );
  }
};
