import { Cart } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "../../../../prisma/prisma-client";
import { CART_TOKEN_NAME } from "../constants/cart";

export const validateCartRequest = async (
  req: NextRequest,
): Promise<
  | {
      token: string;
      cart: Cart;
    }
  | NextResponse<{ error: string }>
> => {
  const token = req.cookies.get(CART_TOKEN_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: "Cart token required" }, { status: 401 });
  }

  const cart = await prisma.cart.findFirst({
    where: {
      token,
    },
  });
  if (!cart) {
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });
  }

  return { token, cart };
};
