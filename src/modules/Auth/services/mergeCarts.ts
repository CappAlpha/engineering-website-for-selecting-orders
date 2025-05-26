import { prisma } from "../../../../prisma/prisma-client";
import { findOrCreateCart } from "../../Cart/services/findOrCreateCart";

export const mergeCarts = async (guestCartToken: string, userId: string) => {
  await prisma.$transaction(async (tx) => {
    const guestCart = await tx.cart.findFirst({
      where: { userId: null, token: guestCartToken },
      include: { items: true },
    });

    if (!guestCart) {
      console.warn("Guest cart not found");
      return;
    }

    const userCart = await findOrCreateCart(guestCartToken, userId);

    // Process each item in the guest cart
    for (const guestItem of guestCart.items) {
      // Check if this product already exists in user's cart
      const existingItem = userCart.items.find(
        (item) => item.productId === guestItem.productId,
      );

      if (existingItem) {
        // Update quantity of existing item
        await tx.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + guestItem.quantity },
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

    await tx.cartItem.deleteMany({
      where: { cartId: guestCart.id },
    });

    await tx.cart.delete({
      where: { id: guestCart.id },
    });
  });
};
