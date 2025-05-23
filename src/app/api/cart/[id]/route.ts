import { NextRequest, NextResponse } from "next/server";

import { updateCartTotalAmount } from "@/modules/Cart/services/updateCartTotalAmount";
import { validateCartRequest } from "@/modules/Cart/services/validateCartRequest";

import { prisma } from "../../../../../prisma/prisma-client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const response = await validateCartRequest(req, params, true);
    if (response instanceof NextResponse) return response;

    const { token, id, quantity } = response;

    const result = await prisma.$transaction(async (tx) => {
      await tx.cartItem.update({
        where: { id },
        data: { quantity },
      });

      return await updateCartTotalAmount(token, tx);
    });
    if (result instanceof NextResponse) return result;

    return NextResponse.json(result);
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
    const response = await validateCartRequest(req, params);
    if (response instanceof NextResponse) return response;

    const { token, id } = response;

    const result = await prisma.$transaction(async (tx) => {
      await tx.cartItem.delete({
        where: {
          id,
        },
      });

      return await updateCartTotalAmount(token, tx);
    });
    if (result instanceof NextResponse) return result;

    return NextResponse.json(result);
  } catch (error) {
    console.error("[CART_DELETE] API error:", error);
    return NextResponse.json(
      { error: "Failed to delete cart" },
      { status: 500 },
    );
  }
}
