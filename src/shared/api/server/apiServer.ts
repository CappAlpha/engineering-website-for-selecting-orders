import * as auth from "./auth";
import * as products from "./products";

export const Api = {
  products,
  auth,
} as const;
