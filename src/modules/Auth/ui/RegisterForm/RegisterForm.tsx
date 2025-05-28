"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { registerUser } from "@/app/actions";
import { Button } from "@/shared/ui/Button";
import { FormInput } from "@/shared/ui/FormInput";

import {
  formRegisterSchema,
  TFormRegisterValues,
} from "../../schemas/authSchemas";

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

      toast.success(
        `Регистрация успешна. 
        Подтвердите свою почту`,
        {
          icon: "\u2705",
        },
      );

      onClose();
    } catch (err) {
      console.error("[REGISTRATION]", err);
      toast.error(
        err instanceof Error ? err.message : "Не удалось зарегистрироваться",
        { icon: "\u274C" },
      );
    }
  };

  return (
    <FormProvider {...form}>
      <form
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
        <FormInput
          name="password"
          label="Пароль"
          type="password"
          required
          autoComplete="new-password"
        />
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
