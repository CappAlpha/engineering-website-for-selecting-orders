import { CartItemDTO } from "../entities/cart";

export const calcCartTotalPrice = (item: CartItemDTO): number => {
  return item.product.price * item.quantity;
};
