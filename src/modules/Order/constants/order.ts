export const OrderConfig = {
  LIFETIME: 15,
  FROM_EMAIL: "onboarding@resend.dev",
} as const;

export const EmailSubject = {
  SUCCESS: "Engineer / Ваш заказ успешно оформлен! Номер заказа #",
  ERROR: "Engineer / Ошибка оформления заказа #",
} as const;
