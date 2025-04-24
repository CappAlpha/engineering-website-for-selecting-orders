export const QuantityAction = {
  PLUS: "plus",
  MINUS: "minus",
} as const;

export type QuantityActionType =
  (typeof QuantityAction)[keyof typeof QuantityAction];
