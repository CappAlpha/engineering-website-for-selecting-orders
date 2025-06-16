"use server";

import { OrderStatus, Prisma } from "@prisma/client";
import { hashSync } from "bcrypt";
import { NextResponse } from "next/server";
import { ReactNode } from "react";

import { getUserSession } from "@/modules/Auth/services/getUserSession";
import { EmailVerification } from "@/modules/Auth/ui/EmailVerification";
import { CartItemDTO } from "@/modules/Cart/entities/cart";
import { cartClear } from "@/modules/Cart/services/cartClear";
import { findCartWithProducts } from "@/modules/Cart/services/findCartWithProducts";
import { updateCartTotalAmount } from "@/modules/Cart/services/updateCartTotalAmount";
import { TCreateProductCardSchema } from "@/modules/Catalog/schemas/createProductCardSchema";
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
      throw new Error("Токен корзины не найден");
    }

    // Find cart
    const userCart = await findCartWithProducts(cartToken);
    if (!userCart) {
      throw new Error("Корзина не найдена");
    }
    if (userCart?.totalAmount === 0) {
      throw new Error("Корзина пуста");
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
      throw new Error("Данные платежа не найдена");
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
    console.error("Server error [CREATE_ORDER_ACTION] ", err);
    throw err;
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
      throw new Error("Пользователь не найден");
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
    console.error("Error [UPDATE_USER_INFO_ACTION]", err);
    throw err;
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
        return NextResponse.json(
          { error: "Почта не подтверждена" },
          { status: 403 },
        );
      }

      return NextResponse.json(
        { error: "Пользователь уже существует" },
        { status: 409 },
      );
    }

    const createdUser = await prisma.user.create({
      data: {
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
    console.error("Error [REGISTER_USER_ACTION]", err);
    throw err;
  }
};

export async function createProduct(
  data: TCreateProductCardSchema,
): Promise<void> {
  try {
    const [categoryName, categorySlug] = data.category.trim().split(",");
    const tagsArray =
      data.tags
        ?.split(",")
        .map((tag) => tag.trim())
        .filter(Boolean) ?? [];
    const imageUrl = data.imageUrl
      ? data.imageUrl?.trim()
      : "/images/catalog/placeholder.webp";

    const productData: Prisma.ProductCreateInput = {
      name: data.name.trim(),
      description: data.description?.trim() ?? "",
      imageUrl,
      tags: [categoryName, ...tagsArray],
      category: {
        connect: { slug: categorySlug },
      },
      price: parseFloat(data.price),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await prisma.$transaction(async (tx) => {
      const existingProduct = await tx.product.findFirst({
        where: {
          name: productData.name,
          categorySlug: productData.category.connect?.slug,
        },
        select: {
          id: true,
        },
      });

      if (existingProduct) {
        throw new Error(
          `Продукт с названием "${productData.name}" уже есть в данной категории "${categorySlug}"`,
        );
      }

      return await tx.product.create({ data: productData });
    });
  } catch (err) {
    console.error("[CREATE_PRODUCT_ACTION]", err);
    throw err;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await prisma.$transaction(async (tx) => {
      const existingProduct = await tx.product.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
        },
      });

      if (!existingProduct) {
        throw new Error(`Продукт с id "${id}" уже удалён`);
      }

      // TODO: Future order page history conflict? make soft delete in DB?
      await prisma.cartItem.deleteMany({
        where: {
          productId: id,
        },
      });

      const cartToken = await getCartToken();
      if (cartToken) {
        await updateCartTotalAmount(cartToken);
      }

      return await prisma.product.delete({
        where: {
          id,
        },
      });
    });
  } catch (err) {
    console.error("[DELETE_PRODUCT_ACTION]", err);
    throw err;
  }
}
