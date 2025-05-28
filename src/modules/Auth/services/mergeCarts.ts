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
    await prisma.$transaction(async (tx) => {
      // Find guest cart
      const guestCart = await tx.cart.findFirst({
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
        await tx.cart.delete({ where: { id: guestCart.id } });
        return;
      }

      // Find user cart
      const userCart = await tx.cart.findUnique({
        where: { userId },
        include: { items: true },
      });

      // If user cart doesn't exist, create it
      if (!userCart) {
        await tx.cart.update({
          where: { id: guestCart.id, token: guestCartToken },
          data: { userId },
        });
        return;
      }

      // Process each item in the guest cart
      for (const guestItem of guestCart.items) {
        const existingItem = userCart.items.find(
          (item) => item.productId === guestItem.productId,
        );

        console.log(existingItem);

        // Check if this product already exists in user's cart
        if (existingItem) {
          // Update quantity of existing item
          await tx.cartItem.update({
            where: { id: existingItem.id },
            data: {
              quantity: Math.min(
                Number(existingItem.quantity) + guestItem.quantity,
                CartQuantityLimits.MAX,
              ),
            },
          });
        } else {
          // Add new item to user's cart
          await tx.cartItem.create({
            data: {
              cartId: userCart.id,
              productId: guestItem.productId,
              quantity: guestItem.quantity,
            },
          });
        }
      }

      // Clear guest cart
      await tx.cartItem.deleteMany({
        where: { cartId: guestCart.id },
      });
      await tx.cart.delete({
        where: { id: guestCart.id },
      });

      // Update total amount
      await updateCartTotalAmount(userCart.token);
    });
  } catch (err) {
    console.error("[CART_MERGE] Error:", err);
  }
};
