import { NextRequest, NextResponse } from "next/server";

import { getCartItem } from "@/modules/Cart/actions/getCartItem";
import { updateCartTotalAmount } from "@/modules/Cart/actions/updateCartTotalAmount";

import { prisma } from "../../../../../prisma/prisma-client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    const data = (await req.json()) as { quantity: number };

    // Get cart token from cookies
    const token = req.cookies.get("cartToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Cart token not found" });
    }

    // Get cart item if exist
    await getCartItem(id);

    await prisma.cartItem.update({
      where: {
        id,
      },
      data: {
        quantity: data.quantity,
      },
    });

    const updateUserCart = await updateCartTotalAmount(token);

    return NextResponse.json(updateUserCart);
  } catch (error) {
    console.error("[CART_PATCH] API error:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);

    // Get cart token from cookies
    const token = req.cookies.get("cartToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Cart token not found" });
    }

    // Get cart item if exist
    await getCartItem(id);

    await prisma.cartItem.delete({
      where: {
        id,
      },
    });

    const updateUserCart = await updateCartTotalAmount(token);

    return NextResponse.json(updateUserCart);
  } catch (error) {
    console.error("[CART_DELETE] API error:", error);
    return NextResponse.json(
      { error: "Failed to delete cart" },
      { status: 500 },
    );
  }
}
