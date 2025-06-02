import * as auth from "./auth";
import * as cart from "./cart";
import * as products from "./products";

export const Api = {
  products,
  cart,
  auth,
} as const;
