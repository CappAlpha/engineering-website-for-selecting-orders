import { z } from "zod";

export const checkoutFormSchema = z.object({
  firstName: z
    .string()
    .min(4, { message: "Полное имя должно содержать не менее 4-х символов" }),
  lastName: z
    .string()
    .min(2, { message: "Фамилия должна содержать не менее 2-х символов" }),
  email: z.string().email({ message: "Введите корректную почту" }),
  phone: z.string().min(18, { message: "Введите корректный номер телефона" }),
  address: z.string().optional(),
  comment: z
    .string()
    .max(200, { message: "Превышено максимальное количество текста" })
    .optional(),
  time: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
