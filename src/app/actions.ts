"use server";

import { OrderStatus, Prisma } from "@prisma/client";
import { hashSync } from "bcrypt";
import { randomUUID } from "crypto";
import { ReactNode } from "react";

import { getUserSession } from "@/modules/Auth/services/getUserSession";
import { EmailVerification } from "@/modules/Auth/ui/EmailVerification";
import { CartItemDTO } from "@/modules/Cart/entities/cart";
import { cartClear } from "@/modules/Cart/services/cartClear";
import { findCartWithProducts } from "@/modules/Cart/services/findCartWithProducts";
import { CheckoutFormValues } from "@/modules/Order/schemas/checkoutFormSchema";
import { createPayment } from "@/modules/Order/services/createPayment";
import { sendEmail } from "@/modules/Order/services/sendEmail";
import { EmailMakeOrder } from "@/modules/Order/ui/EmailMakeOrder";
import { getCartToken } from "@/shared/lib/getCartToken";

import { prisma } from "../../prisma/prisma-client";

/**
 * Create order from cart
 * @param data - Checkout form values
 * @returns URL to payment service
 * @throws Error if cart not found or cart is empty
 */
export const createOrder = async (data: CheckoutFormValues) => {
  try {
    const cartToken = await getCartToken();

    if (!cartToken) {
      throw new Error("Cart token not found");
    }

    // Find cart
    const userCart = await findCartWithProducts(cartToken);
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

    await cartClear(userCart);

    // Get data from payment
    const paymentData = await createPayment({
      description: "Оплата заказа #" + order.id,
      orderId: order.id,
      amount: order.totalAmount,
    });
    if (!paymentData) {
      await prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: OrderStatus.CANCELLED,
        },
      });
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
    const items = JSON.parse(order?.items as string) as CartItemDTO[];

    // Send info about order on email
    await sendEmail(
      data.email,
      "Engineer / Оплатите заказ #" + order.id,
      EmailMakeOrder({
        orderId: order.id,
        totalAmount: order.totalAmount,
        paymentUrl: paymentUrl,
        items,
      }) as ReactNode,
    );

    return paymentUrl;
  } catch (err) {
    console.error("Server error [CREATE_ORDER] ", err);
  }
};

/**
 * Updates the current user's information in the database.
 * @param data - The user data to update, including fullName, email, and password.
 * @throws Error if the user is not found or update operation fails.
 */
export const updateUserInfo = async (data: Prisma.UserUpdateInput) => {
  try {
    const currentUser = await getUserSession();
    if (!currentUser) {
      throw new Error("User not found");
    }

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        fullName: data.fullName,
        email: data.email,
        password: data.password
          ? hashSync(data.password as string, 12)
          : currentUser.password,
        phone: data.phone,
        address: data.address,
      },
    });
  } catch (err) {
    console.error("Error [UPDATE_USER_INFO]", err);
  }
};

export const registerUser = async (
  data: Omit<Prisma.UserCreateInput, "id">,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (user) {
      if (!user.verified) {
        throw new Error("Почта не подтверждена");
      }

      throw new Error("Пользователь уже существует");
    }

    const createdUser = await prisma.user.create({
      data: {
        id: randomUUID(),
        fullName: data.fullName,
        email: data.email,
        password: hashSync(data.password, 12),
      },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.verificationCode.create({
      data: {
        code,
        userId: createdUser.id,
      },
    });

    await sendEmail(
      createdUser.email,
      "Engineer / Подтверждение регистрации",
      EmailVerification({ code }) as ReactNode,
    );
  } catch (err) {
    console.error("Error [REGISTER_USER]", err);
  }
};
