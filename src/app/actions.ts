"use server";

import type { Prisma } from "@prisma/client";
import { OrderStatus } from "@prisma/client";
import { hashSync } from "bcrypt";
import { createElement } from "react";

import { getUserSession } from "@/modules/Auth/services/getUserSession";
import { EmailVerification } from "@/modules/Auth/ui/EmailVerification";
import type { CartItemDTO } from "@/modules/Cart/entities/cart";
import { cartClear } from "@/modules/Cart/services/cartClear";
import { findCartWithProducts } from "@/modules/Cart/services/findCartWithProducts";
import { updateCartTotalAmount } from "@/modules/Cart/services/updateCartTotalAmount";
import type { TCreateProductCardSchema } from "@/modules/Catalog/schemas/createProductCardSchema";
import { OrderConfig } from "@/modules/Order/constants/order";
import type { CheckoutFormValues } from "@/modules/Order/schemas/checkoutFormSchema";
import { createPayment } from "@/modules/Order/services/createPayment";
import { getPaymentUrlById } from "@/modules/Order/services/getPaymentUrlById";
import { sendEmail } from "@/modules/Order/services/sendEmail";
import { EmailMakeOrder } from "@/modules/Order/ui/EmailMakeOrder";
import { getCartToken } from "@/shared/lib/getCartToken";

import { prisma } from "../../prisma/prisma-client";

/**
 * Create order from cart
 * @param data - Checkout form values
 * @returns URL to payment service
 * @throws Error if cart not found, cart is empty, or other failures
 */
export const createOrder = async (data: CheckoutFormValues) => {
  "use server";

  const cartToken = await getCartToken();
  if (!cartToken) throw new Error("Токен корзины не найден");

  // Find cart
  const userCart = await findCartWithProducts(cartToken);
  if (!userCart) throw new Error("Корзина не найдена");
  if (userCart.totalAmount === 0) throw new Error("Корзина пуста");

  const lifetimeMs = Number(OrderConfig.LIFETIME) * 60_000;
  const staleBefore = new Date(Date.now() - lifetimeMs);

  // Cancel stale orders
  await prisma.order.updateMany({
    where: {
      token: cartToken,
      status: OrderStatus.PENDING,
      createdAt: { lt: staleBefore },
    },
    data: { status: OrderStatus.CANCELLED },
  });

  // Find existing order
  let existing = await prisma.order.findFirst({
    where: { token: cartToken, status: OrderStatus.PENDING },
    orderBy: { id: "desc" },
  });

  if (existing && existing.totalAmount !== userCart.totalAmount) {
    await prisma.order.update({
      where: { id: existing.id },
      data: { status: OrderStatus.CANCELLED },
    });
    existing = null;
  }

  if (existing) {
    if (existing.paymentId) {
      const url = await getPaymentUrlById(existing.paymentId);
      if (url) {
        await cartClear(userCart);
        return url;
      }
    }

    const paymentData = await createPayment({
      orderId: existing.id,
      amount: existing.totalAmount,
      description: `Оплата заказа #${existing.id}`,
    });

    await prisma.order.update({
      where: { id: existing.id },
      data: { paymentId: paymentData.id },
    });

    return paymentData.url;
  }

  try {
    // Create order
    const order = await prisma.order.create({
      data: {
        token: cartToken,
        userId: userCart.userId,
        totalAmount: userCart.totalAmount,
        status: OrderStatus.PENDING,
        items: JSON.stringify(userCart.items),
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        address: data.address,
        comment: data.comment,
      },
    });

    // Create payment order
    const paymentData = await createPayment({
      description: `Оплата заказа #${order.id}`,
      orderId: order.id,
      amount: order.totalAmount,
    });

    if (!paymentData) throw new Error("Данные платежа не получены");

    // Update order with paymentId
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: paymentData.id },
    });

    // Clear cart after order creation
    await cartClear(userCart);

    const paymentUrl = paymentData.url;
    const items = JSON.parse(order.items as string) as CartItemDTO[];

    const emailElement = createElement(EmailMakeOrder, {
      orderId: order.id,
      totalAmount: order.totalAmount,
      paymentUrl,
      items,
    });

    // Send order confirmation email
    await sendEmail(
      data.email,
      `Engineer / Оплатите заказ #${order.id}`,
      emailElement,
    );

    return paymentUrl;
  } catch (err) {
    // Rollback order status to CANCELLED on failure
    await prisma.order.updateMany({
      where: { token: cartToken, status: OrderStatus.PENDING },
      data: { status: OrderStatus.CANCELLED },
    });
    console.error("[CREATE_ORDER_ACTION] Server error: ", err);
    throw err;
  }
};

/**
 * Updates the current user's information in the database.
 * @param data - The user data to update, including fullName, email, password, phone, and address.
 * @throws Error if the user is not found or update operation fails.
 */
export const updateUserInfo = async (data: Prisma.UserUpdateInput) => {
  const currentUser = await getUserSession();
  if (!currentUser) {
    throw new Error("Пользователь не найден");
  }

  try {
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        fullName: data.fullName,
        email: data.email,
        password: data.password && hashSync(data.password as string, 12),
        phone: data.phone,
        address: data.address,
      },
    });
  } catch (err) {
    console.error("[UPDATE_USER_INFO_ACTION] Server error: ", err);
    throw err;
  }
};

/**
 * Registers a new user and sends a verification email.
 * @param data - The user creation data, excluding id.
 * @throws Error if user already exists, email not verified, or other failures.
 */
export const registerUser = async (
  data: Omit<Prisma.UserCreateInput, "id">,
) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      if (!existingUser.verified) {
        throw new Error("Почта не подтверждена");
      }
      throw new Error("Пользователь уже существует");
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

    const emailElement = createElement(EmailVerification, { code });

    await sendEmail(
      createdUser.email,
      "Engineer / Подтверждение регистрации",
      emailElement,
    );
  } catch (err) {
    console.error("[REGISTER_USER_ACTION] Server error: ", err);
    throw err;
  }
};

/**
 * Creates a new product if it doesn't already exist in the category.
 * @param data - The product creation schema data.
 * @throws Error if product already exists in the category or creation fails.
 */
export async function createProduct(data: TCreateProductCardSchema) {
  const [categoryName, categorySlug] = data.category.trim().split(",");
  const tagsArray =
    data.tags
      ?.split(",")
      .map((tag) => tag.trim())
      .filter(Boolean) ?? [];
  const imageUrl = data.imageUrl?.trim() ?? "/images/catalog/placeholder.webp";

  const productData: Prisma.ProductCreateInput = {
    name: data.name.trim(),
    description: data.description?.trim() ?? "",
    imageUrl,
    tags: [categoryName, ...tagsArray],
    category: {
      connect: { slug: categorySlug },
    },
    price: Number.parseFloat(data.price),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
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
          `Продукт с названием "${productData.name}" уже существует в категории "${categorySlug}"`,
        );
      }

      await tx.product.create({ data: productData });
    });
  } catch (err) {
    console.error("[CREATE_PRODUCT_ACTION] Server error: ", err);
    throw err;
  }
}

/**
 * Deletes a product and cleans up associated cart items.
 * Updates the current cart's total if a cart token is present.
 * @param id - The ID of the product to delete.
 * @throws Error if product not found or deletion fails.
 */
export async function deleteProduct(id: string) {
  try {
    await prisma.$transaction(async (tx) => {
      const existingProduct = await tx.product.findUnique({
        where: { id },
        select: {
          id: true,
        },
      });

      if (!existingProduct) {
        throw new Error(`Продукт с id "${id}" не найден`);
      }

      // Delete associated cart items
      await tx.cartItem.deleteMany({
        where: { productId: id },
      });

      // Delete the product
      await tx.product.delete({
        where: { id },
      });
    });

    // Update current cart total if token exists (note: consider updating all affected carts in future)
    const cartToken = await getCartToken();
    if (cartToken) {
      await updateCartTotalAmount(cartToken);
    }
  } catch (err) {
    console.error("[DELETE_PRODUCT_ACTION] Server error: ", err);
    throw err;
  }
}
