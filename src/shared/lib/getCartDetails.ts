import { CartStateItem, CartDTO } from "../entities/cart";
import { calcCartTotalPrice } from "./calcCartTotalPrice";

export interface CartReturnProps {
  items: CartStateItem[];
  totalAmount: number;
}

export const getCartDetails = (data: CartDTO): CartReturnProps => {
  const items = data.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    name: item.product.name,
    description: item.product.description,
    imageUrl: item.product.imageUrl,
    price: calcCartTotalPrice(item),
  }));

  return {
    items,
    totalAmount: data.totalAmount,
  };
};
