import { NextResponse } from "next/server";

import { getUserSession } from "@/modules/Auth/services/getUserSession";

import { prisma } from "../../../../../prisma/prisma-client";

export const GET = async () => {
  try {
    const user = await getUserSession();

    if (!user) {
      return NextResponse.json(
        { message: "Вы не авторизованы" },
        { status: 401 },
      );
    }

    const data = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        fullName: true,
        email: true,
        phone: true,
        address: true,
      },
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error("[AUTH_ME_GET] API error:", err);
    return NextResponse.json(
      { error: "Failed to get me auth session" },
      { status: 500 },
    );
  }
};
