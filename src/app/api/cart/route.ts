import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { getUserSession } from "@/modules/Auth/services/getUserSession";
import {
  CartQuantityLimits,
  CART_TOKEN_NAME,
} from "@/modules/Cart/constants/cart";
import { CreateCartItemValues } from "@/modules/Cart/entities/cart";
import { findOrCreateCart } from "@/modules/Cart/services/findOrCreateCart";
import { updateCartTotalAmount } from "@/modules/Cart/services/updateCartTotalAmount";
import { validateCartRequest } from "@/modules/Cart/services/validateCartRequest";

import { prisma } from "../../../../prisma/prisma-client";

const DEFAULT_RESPONSE = { totalAmount: 0, items: [] };

export async function GET(req: NextRequest) {
  try {
    // Get cart token from cookies
    const token = req.cookies.get(CART_TOKEN_NAME)?.value;

    // Get user ID if logged in
    const session = await getUserSession();
    const userId = session?.id;

    if (!token && !userId) {
      return NextResponse.json(DEFAULT_RESPONSE);
    }

    // Search cart by token or userId
    const userCart = await prisma.cart.findFirst({
      where: {
        OR: [...(token ? [{ token }] : []), ...(userId ? [{ userId }] : [])],
      },
      include: {
        items: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(userCart ?? DEFAULT_RESPONSE);
  } catch (error) {
    console.error("[CART_GET] API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    //Generate token if not exist
    const token = req.cookies.get(CART_TOKEN_NAME)?.value ?? randomUUID();

    // Get user ID if logged in
    const session = await getUserSession();
    const userId = session?.id;

    // Find or create cart by token
    const userCart = await findOrCreateCart(token, userId);

    const data = (await req.json()) as CreateCartItemValues;

    // Find cart item for product
    const findCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: userCart.id,
        productId: data.productId,
      },
    });

    // Check quantity limit
    if (findCartItem && findCartItem.quantity >= CartQuantityLimits.MAX) {
      return NextResponse.json(
        {
          error: `Cannot add more items. Maximum quantity (${CartQuantityLimits.MAX}) reached.`,
        },
        { status: 400 },
      );
    }

    // Use transaction to update or create cart item
    await prisma.$transaction([
      findCartItem
        ? prisma.cartItem.update({
            where: { id: findCartItem.id },
            data: { quantity: findCartItem.quantity + 1 },
          })
        : prisma.cartItem.create({
            data: {
              cartId: userCart.id,
              productId: data.productId,
              quantity: 1,
            },
          }),
    ]);

    const updatedCart = await updateCartTotalAmount(token);

    // Prepare response with updated cart and set cookie if new token generated
    const resp = NextResponse.json(updatedCart);
    resp.cookies.set(CART_TOKEN_NAME, token);
    return resp;
  } catch (error) {
    console.error("[CART_POST] API error:", error);
    return NextResponse.json({ error: "Failed to make cart" }, { status: 500 });
  }
}

// In /api/cart/route.ts
export async function DELETE(req: NextRequest) {
  try {
    const response = await validateCartRequest(req);
    if (response instanceof NextResponse) return response;

    const { token, cart } = response;

    const result = await prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return await updateCartTotalAmount(token, tx);
    });

    if (result instanceof NextResponse) return result;
    return NextResponse.json(result);
  } catch (error) {
    console.error("[CART_DELETE_ALL_ITEMS] API error:", error);
    return NextResponse.json(
      { error: "Failed to delete all cart items" },
      { status: 500 },
    );
  }
}
