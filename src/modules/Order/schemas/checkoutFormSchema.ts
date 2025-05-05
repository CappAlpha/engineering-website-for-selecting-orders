import { z } from "zod";

export const checkoutFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Имя должно содержать не менее 2-х символов" }),
  lastName: z
    .string()
    .min(2, { message: "Фамилия должна содержать не менее 2-х символов" }),
  email: z.string().email({ message: "Введите корректную почту" }),
  phone: z
    .string()
    .min(11, { message: "Введите корректный номер телефона" })
    .optional(),
  address: z
    .string()
    .min(5, { message: "Введите корректный адрес" })
    .optional(),
  comment: z
    .string()
    .max(200, { message: "Превышено максимальное количество текста" })
    .optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
