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
      .min(2, { message: "Имя должно содержать не менее 2-х символов" })
      .optional(),
    email: z.string().email({ message: "Введите корректную почту" }).optional(),
    password: passwordSchema,
    confirmPassword: passwordSchema,
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
