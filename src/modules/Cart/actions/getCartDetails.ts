import { calcCartTotalPrice } from "@/modules/Cart/actions/calcCartTotalPrice";
import { CartStateItem, CartDTO } from "@/modules/Cart/entities/cart";

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
