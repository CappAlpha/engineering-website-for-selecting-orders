"use server";

import { OrderStatus } from "@prisma/client";
import { cookies } from "next/headers";
import { ReactNode } from "react";

import { createPayment } from "@/modules/Order/actions/createPayment";
import { sendEmail } from "@/modules/Order/actions/sendEmail";
import { CheckoutFormValues } from "@/modules/Order/schemas/checkoutFormSchema";
import { EmailOrderTemplate } from "@/modules/Order/ui/EmailOrderTemplate";
import { CART_TOKEN_NAME } from "@/shared/constants/cart";

import { prisma } from "../../prisma/prisma-client";

export const createOrder = async (data: CheckoutFormValues) => {
  try {
    const cookieStore = cookies();
    const cartToken = (await cookieStore).get(CART_TOKEN_NAME)?.value;

    if (!cartToken) {
      throw new Error("Cart token not found");
    }

    // Find cart
    const userCart = await prisma.cart.findFirst({
      where: {
        token: cartToken,
      },
      include: {
        user: true,
        items: true,
      },
    });
    if (!userCart) {
      throw new Error("Cart not found");
    }
    if (userCart?.totalAmount === 0) {
      throw new Error("Cart is empty");
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        token: cartToken,
        totalAmount: userCart.totalAmount,
        status: OrderStatus.PENDING,
        items: JSON.stringify(userCart.items),
        fullName: data.firstName + " " + data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        comment: data.comment,
      },
    });

    // Clear cart
    await prisma.cart.update({
      where: {
        id: userCart.id,
      },
      data: {
        totalAmount: 0,
      },
    });
    await prisma.cartItem.deleteMany({
      where: {
        cartId: userCart.id,
      },
    });

    // Get data from payment
    const paymentData = await createPayment({
      description: "Оплата заказа #" + order.id,
      orderId: order.id,
      amount: order.totalAmount,
    });
    if (!paymentData) {
      throw new Error("Payment data not found");
    }

    // Add paymentId to order
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        paymentId: paymentData.id,
      },
    });

    const paymentUrl = paymentData.url;

    // Send info about order on email
    await sendEmail(
      data.email,
      "Engineer / Оплатите заказ #" + order.id,
      EmailOrderTemplate({
        orderId: order.id,
        totalAmount: order.totalAmount,
        paymentUrl: paymentUrl,
      }) as ReactNode,
    );

    return paymentUrl;
  } catch (err) {
    console.error("[CreateOrder] Server error", err);
  }
};
