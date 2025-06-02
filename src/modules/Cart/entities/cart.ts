import { Cart, CartItem, Product } from "@prisma/client";

export type CartItemDTO = CartItem & {
  product: Product;
};

export interface CartDTO extends Cart {
  items: CartItemDTO[];
}

export interface CartStateItem {
  id: number;
  quantity: number;
  name: string;
  description: string;
  imageUrl: string | null;
  price: number;
}

export interface CreateCartItemValues {
  productId: string;
}
