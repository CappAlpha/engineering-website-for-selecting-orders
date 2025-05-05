export const QuantityAction = {
  PLUS: "plus",
  MINUS: "minus",
} as const;

export type QuantityActionType =
  (typeof QuantityAction)[keyof typeof QuantityAction];

export const CART_QUANTITY_LIMITS = {
  MIN: 1,
  MAX: 10,
} as const;

export const CART_TOKEN_NAME = "cartToken";
