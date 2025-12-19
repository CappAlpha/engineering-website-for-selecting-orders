"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useCartQueries } from "@/modules/Cart/hooks/useCartQueries";
import { Button } from "@/shared/ui/Button";
import { FormInput } from "@/shared/ui/FormInput";
import { ShowPasswordInput } from "@/shared/ui/ShowPasswordInput";

import type { TFormLoginValues } from "../../schemas/authSchemas";
import { formLoginSchema } from "../../schemas/authSchemas";

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
  const { refetchCart } = useCartQueries();

  const onSubmit = async (data: TFormLoginValues) => {
    try {
      const resp = await signIn("credentials", { ...data, redirect: false });

      if (!resp?.ok) {
        if (String(resp?.error).includes("CredentialsSignin")) {
          throw new Error("Неправильная почта или пароль");
        }

        throw new Error(resp?.error ?? "SignIn error");
      }

      toast.success("Вы успешно вошли в аккаунт!", {
        icon: "\u2705",
      });

      await refetchCart();
      onClose();
    } catch (err) {
      console.error("[Error [LOGIN]]", err);
      form.setError("password", {
        type: "manual",
        message: err instanceof Error ? err.message : "SignIn error",
      });
      toast.error(
        err instanceof Error ? err.message : "Не удалось войти в аккаунт",
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
        <FormInput
          name="email"
          label="E-Mail"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          focused
          autoFocus
        />

        <ShowPasswordInput autoComplete="current-password" />

        {/* TODO: add forgot password modal? */}
        {/* <div className={s.optionsRow}>
          <a className={s.forgot} href="/forgot-password">
            Забыли пароль?
          </a>
        </div> */}

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
