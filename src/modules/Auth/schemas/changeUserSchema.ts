import { z } from "zod";

const passwordSchema = z
  .string()
  .optional()
  .refine((val) => !val || val.length >= 6, {
    message: "Пароль должен содержать не менее 6 символов",
  });

export const formChangeUserSchema = z
  .object({
    fullName: z
      .string()
      .min(4, { message: "Полное имя должно содержать не менее 4-х символов" })
      .optional(),
    email: z.string().email({ message: "Введите корректную почту" }).optional(),
    password: passwordSchema,
    confirmPassword: passwordSchema,
    phone: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 11, {
        message: "Введите корректный номер телефона",
      }),
    address: z.string().optional(),
  })
  .refine(
    (data) =>
      (!data.password && !data.confirmPassword) ||
      data.password === data.confirmPassword,
    {
      message: "Пароли не совпадают",
      path: ["confirmPassword"],
    },
  );

export type TFormChangeUserValues = z.infer<typeof formChangeUserSchema>;
