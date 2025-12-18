"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { registerUser } from "@/app/actions";
import { Button } from "@/shared/ui/Button";
import { FormInput } from "@/shared/ui/FormInput";
import { ShowPasswordInput } from "@/shared/ui/ShowPasswordInput";

import type { TFormRegisterValues } from "../../schemas/authSchemas";
import { formRegisterSchema } from "../../schemas/authSchemas";

import s from "./RegisterForm.module.scss";

interface Props {
  onClose: VoidFunction;
}

export const RegisterForm: FC<Props> = ({ onClose }) => {
  const form = useForm<TFormRegisterValues>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: TFormRegisterValues) => {
    try {
      await registerUser({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      });

      toast.success("Регистрация успешна. Подтвердите свою почту", {
        icon: "\u2705",
      });

      onClose();
    } catch (err) {
      console.error("[REGISTRATION]", err);
      toast.error(
        `Не удалось зарегистрироваться!
        Либо такой пользователь уже существует`,
        { icon: "\u274C" },
      );
    }
  };

  return (
    <FormProvider {...form}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={form.handleSubmit(onSubmit)}
        className={s.root}
        noValidate
      >
        <FormInput name="fullName" label="Полное имя" type="text" required />
        <FormInput
          name="email"
          label="E-Mail"
          type="email"
          required
          autoComplete="new-email"
        />
        <ShowPasswordInput autoComplete="new-password" />
        <FormInput
          name="confirmPassword"
          label="Повторите пароль"
          type="password"
          required
          autoComplete="new-password"
        />

        <Button
          loading={form.formState.isSubmitting}
          className={s.registerBtn}
          type="submit"
        >
          Зарегистрироваться
        </Button>
      </form>
    </FormProvider>
  );
};
