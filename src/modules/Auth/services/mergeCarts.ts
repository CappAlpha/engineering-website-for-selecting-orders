import { CartQuantityLimits } from "@/modules/Cart/constants/cart";
import { updateCartTotalAmount } from "@/modules/Cart/services/updateCartTotalAmount";

import { prisma } from "../../../../prisma/prisma-client";

/**
 * Merge guest cart with user cart
 * @param guestCartToken
 * @param userId - ID authenticated user
 * @returns Promise<void>
 */
export const mergeCarts = async (guestCartToken: string, userId: string) => {
  if (!guestCartToken || !userId) {
    console.error("[CART_MERGE] Missing required parameters for cart merge");
    return;
  }

  try {
    // Find guest cart
    const guestCart = await prisma.cart.findFirst({
      where: { userId: null, token: guestCartToken },
      include: { items: true },
    });

    if (!guestCart) {
      console.warn(
        `[CART_MERGE] Guest cart not found for token: ${guestCartToken}`,
      );
      return;
    }

    if (guestCart.items.length === 0) {
      console.info("[CART_MERGE]  Guest cart is empty, nothing to merge");
      await prisma.cart.delete({ where: { id: guestCart.id } });
      return;
    }

    // Find user cart
    const userCart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    // If user cart doesn't exist, create it
    if (!userCart) {
      await prisma.cart.update({
        where: { id: guestCart.id },
        data: { userId },
      });
      return;
    }

    // Process each item in the guest cart
    for (const guestItem of guestCart.items) {
      // Check if this product already exists in user's cart
      const existingItem = userCart.items.find(
        (item) => item.productId === guestItem.productId,
      );

      if (existingItem) {
        // Update quantity of existing item
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          // TODO: improve logic?
          data: {
            quantity:
              existingItem.quantity + guestItem.quantity <=
              CartQuantityLimits.MAX
                ? existingItem.quantity + guestItem.quantity
                : CartQuantityLimits.MAX,
          },
        });
      } else {
        // Add new item to user's cart
        await prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: guestItem.productId,
            quantity:
              guestItem.quantity <= CartQuantityLimits.MAX
                ? guestItem.quantity
                : CartQuantityLimits.MAX,
          },
        });
      }
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: guestCart.id },
    });

    await prisma.cart.delete({
      where: { id: guestCart.id },
    });

    await updateCartTotalAmount(userCart.token);
  } catch (err) {
    console.error("[CART_MERGE] Error:", err);
  }
};
