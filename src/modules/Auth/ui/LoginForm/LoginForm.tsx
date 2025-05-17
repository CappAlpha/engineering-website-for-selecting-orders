"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/shared/ui/Button";
import { FormInput } from "@/shared/ui/FormInput";

import { Login } from "../../../../../public/icon";
import { formLoginSchema, TFormLoginValues } from "../../schemas/authSchemas";

import s from "./LoginForm.module.scss";

interface Props {
  onClose: VoidFunction;
}

export const LoginForm: FC<Props> = ({ onClose }) => {
  const form = useForm<TFormLoginValues>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: TFormLoginValues) => {
    try {
      const resp = await signIn("credentials", { ...data, redirect: false });

      if (resp?.error) {
        throw new Error(resp.error);
      }

      toast.success("Вы успешно вошли в аккаунт!", {
        icon: "\u2705",
      });

      onClose();
    } catch (err) {
      console.error("[Error [LOGIN]]", err);
      toast.error("Не удалось войти в аккаунт", { icon: "\u274C" });
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={s.root}
        noValidate
      >
        <div className={s.headerWrap}>
          <div>
            <h6 className={s.title}>Вход в аккаунт</h6>
            <p className={s.description}>
              Введите свою почту, чтобы войти в свой аккаунт
            </p>
          </div>
          <Login className={s.loginIcon} />
        </div>

        <FormInput
          name="email"
          label="E-Mail"
          type="email"
          required
          autoComplete="email"
        />
        <FormInput
          name="password"
          label="Пароль"
          type="password"
          required
          autoComplete="password"
        />

        <Button
          loading={form.formState.isSubmitting}
          className={s.loginBtn}
          type="submit"
        >
          Войти
        </Button>
      </form>
    </FormProvider>
  );
};
