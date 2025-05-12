import { OrderStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ReactNode } from "react";

import { CartItemDTO } from "@/modules/Cart/entities/cart";
import { sendEmail } from "@/modules/Order/actions/sendEmail";
import { PaymentCallbackData } from "@/modules/Order/entities/orderResponse";
import { EmailErrorTemplate } from "@/modules/Order/ui/EmailErrorTemplate";
import { EmailSuccessTemplate } from "@/modules/Order/ui/EmailSuccessTemplate";

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
    const isSucceeded = body.state === "payed";
    await prisma.order.update({
      where: {
        id: Number(body.extra),
      },
      data: {
        status: isSucceeded ? OrderStatus.SUCCEEDED : OrderStatus.CANCELLED,
      },
    });
    if (isSucceeded) {
      const items = JSON.parse(order?.items as string) as CartItemDTO[];

      await sendEmail(
        order.email,
        "Engineer / Ваш заказ успешно оформлен! Номер заказа #" + order.id,
        EmailSuccessTemplate({
          orderId: order.id,
          items,
        }) as ReactNode,
      );
    } else {
      await sendEmail(
        order.email,
        "Engineer / Ошибка оформления заказа #" + order.id,
        EmailErrorTemplate({}) as ReactNode,
      );
      throw new Error("Payment is canceled by api");
    }
  } catch (err) {
    console.error("[Checkout Callback] Error:", err);
    return NextResponse.json(
      { error: "Failed to get payment info" },
      { status: 500 },
    );
  }
}
