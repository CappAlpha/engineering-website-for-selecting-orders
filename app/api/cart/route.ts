import { NextRequest, NextResponse } from "next/server";

import { CART_QUANTITY_LIMITS } from "@/constants/cart";
import { CreateCartItemValues } from "@/entities/cart";
import { findOrCreateCart } from "@/utils/findOrCreateCart";
import { updateCartTotalAmount } from "@/utils/updateCartTotalAmount";

import { prisma } from "../../../prisma/prisma-client";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("cartToken")?.value;
    const defaultResponse = { totalAmount: 0, items: [] };

    if (!token) {
      return NextResponse.json(defaultResponse);
    }

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

    return NextResponse.json(userCart ?? defaultResponse);
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
    const token = req.cookies.get("cartToken")?.value ?? crypto.randomUUID();

    const userCart = await findOrCreateCart(token);

    const data = (await req.json()) as CreateCartItemValues;

    const findCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: userCart.id,
        productId: data.productId,
      },
    });

    if (findCartItem && findCartItem.quantity >= CART_QUANTITY_LIMITS.MAX) {
      return NextResponse.json(
        {
          error: `Cannot add more items. Maximum quantity (${CART_QUANTITY_LIMITS.MAX}) reached.`,
        },
        { status: 400 },
      );
    }

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

    const updateUserCart = await updateCartTotalAmount(token);

    const resp = NextResponse.json(updateUserCart);
    resp.cookies.set("cartToken", token);
    return resp;
  } catch (error) {
    console.error("[CART_POST] API error:", error);
    return NextResponse.json({ error: "Failed to make cart" }, { status: 500 });
  }
}
