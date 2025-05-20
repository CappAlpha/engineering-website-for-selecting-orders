import { OrderStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ReactNode } from "react";

import { CartItemDTO } from "@/modules/Cart/entities/cart";
import { EmailSubject } from "@/modules/Order/constants/order";
import { PaymentCallbackData } from "@/modules/Order/entities/orderResponse";
import { sendEmail } from "@/modules/Order/services/sendEmail";
import { EmailError } from "@/modules/Order/ui/EmailError";
import { EmailSuccess } from "@/modules/Order/ui/EmailSuccess";

import { prisma } from "../../../../../prisma/prisma-client";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PaymentCallbackData;

    // find order
    const order = await prisma.order.findFirst({
      where: {
        id: Number(body.extra),
      },
    });
    if (!order) {
      return NextResponse.json(
        { error: "Failed to get order" },
        { status: 400 },
      );
    }

    // if success send email or set status cancelled
    const isPaymentSuccessful = body.state === "payed";
    await prisma.order.update({
      where: {
        id: Number(body.extra),
      },
      data: {
        status: isPaymentSuccessful
          ? OrderStatus.SUCCEEDED
          : OrderStatus.CANCELLED,
      },
    });

    if (isPaymentSuccessful) {
      const items = JSON.parse(order?.items as string) as CartItemDTO[];

      await sendEmail(
        order.email,
        EmailSubject.SUCCESS + order.id,
        EmailSuccess({
          orderId: order.id,
          items,
        }) as ReactNode,
      );
    } else {
      await sendEmail(
        order.email,
        EmailSubject.ERROR + order.id,
        EmailError({}) as ReactNode,
      );
      throw new Error("Payment is canceled by api");
    }

    return NextResponse.json(
      {
        success: true,
        status: isPaymentSuccessful ? "succeeded" : "cancelled",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[CHECKOUT_CALLBACK] API error:", err);
    return NextResponse.json(
      { error: "Failed to get payment info" },
      { status: 500 },
    );
  }
}
