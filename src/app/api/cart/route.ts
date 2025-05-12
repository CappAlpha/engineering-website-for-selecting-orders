import { NextRequest, NextResponse } from "next/server";

import { findOrCreateCart } from "@/modules/Cart/actions/findOrCreateCart";
import { updateCartTotalAmount } from "@/modules/Cart/actions/updateCartTotalAmount";
import { CreateCartItemValues } from "@/modules/Cart/entities/cart";
import { CART_QUANTITY_LIMITS, CART_TOKEN_NAME } from "@/shared/constants/cart";

import { prisma } from "../../../../prisma/prisma-client";

const DEFAULT_RESPONSE = { totalAmount: 0, items: [] };

export async function GET(req: NextRequest) {
  try {
    // Get cart token from cookies
    const token = req.cookies.get(CART_TOKEN_NAME)?.value;
    if (!token) {
      return NextResponse.json(DEFAULT_RESPONSE);
    }

    // Search cart by token if exist
    const userCart = await prisma.cart.findFirst({
      where: {
        OR: [
          {
            token,
          },
        ],
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
    const token =
      req.cookies.get(CART_TOKEN_NAME)?.value ?? crypto.randomUUID();

    // Find or create cart by token
    const userCart = await findOrCreateCart(token);

    const data = (await req.json()) as CreateCartItemValues;

    // Find cart item for product
    const findCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: userCart.id,
        productId: data.productId,
      },
    });

    // Check quantity limit
    if (findCartItem && findCartItem.quantity >= CART_QUANTITY_LIMITS.MAX) {
      return NextResponse.json(
        {
          error: `Cannot add more items. Maximum quantity (${CART_QUANTITY_LIMITS.MAX}) reached.`,
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
