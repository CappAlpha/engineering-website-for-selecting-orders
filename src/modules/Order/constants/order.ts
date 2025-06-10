export const OrderConfig = {
  LIFETIME: 15,
  FROM_EMAIL: "onboarding@resend.dev",
} as const;

export const EmailSubject = {
  SUCCESS: "Engineer / Ваш заказ успешно оформлен! Номер заказа #",
  ERROR: "Engineer / Ошибка оформления заказа #",
} as const;

export const TimeRange = [
  {
    id: 1,
    name: "7:00 - 11:00",
    slug: "morning",
  },
  {
    id: 2,
    name: "11:00 - 17:00",
    slug: "day",
  },
  {
    id: 3,
    name: "17:00 - 23:00",
    slug: "evening",
  },
];
