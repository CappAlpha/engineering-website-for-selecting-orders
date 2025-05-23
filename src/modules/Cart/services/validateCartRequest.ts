import { Cart, CartItem } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { CART_TOKEN_NAME } from "@/modules/Cart/constants/cart";

import { prisma } from "../../../../prisma/prisma-client";

export const validateCartRequest = async (
  req: NextRequest,
  params: Promise<{ id: string }>,
  needQuantity?: boolean,
): Promise<
  | {
      token: string;
      id: number;
      quantity: number | undefined;
      cartItem: CartItem;
      cart: Cart;
    }
  | NextResponse<{ error: string }>
> => {
  const token = req.cookies.get(CART_TOKEN_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: "Cart token required" }, { status: 401 });
  }

  const id = Number((await params).id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
  }

  const cart = await prisma.cart.findFirst({
    where: {
      token,
    },
  });
  if (!cart) {
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: {
      id,
    },
  });
  if (!cartItem) {
    return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  }

  let quantity: number | undefined;
  if (needQuantity) {
    const { quantity: quantityData } = (await req.json()) as {
      quantity: number | undefined;
    };
    quantity = quantityData;
  }

  return { token, id, quantity, cart, cartItem };
};
