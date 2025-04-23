import * as cart from "./cart";
import * as products from "./products";
import * as tags from "./tags";

export const Api = {
  products,
  tags,
  cart,
} as const;
