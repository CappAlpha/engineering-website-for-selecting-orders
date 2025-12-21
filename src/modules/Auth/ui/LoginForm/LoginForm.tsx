"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { startTransition, type FC } from "react";
import type { SubmitHandler } from "react-hook-form";
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
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const { refetchCart } = useCartQueries();

  const onSubmit: SubmitHandler<TFormLoginValues> = async (data) => {
    try {
      const response = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (!response?.ok) {
        const errorMessage = response?.error?.includes("CredentialsSignin")
          ? "Неправильная почта или пароль"
          : response?.error || "Произошла ошибка при входе";

        throw new Error(errorMessage);
      }

      toast.success("Вы успешно вошли в аккаунт!", {
        icon: "\u2705",
      });

      onClose();
      startTransition(() => {
        void refetchCart();
      });
    } catch (err) {
      console.error("[LOGIN_FORM]", err);

      const message = err instanceof Error ? err.message : "Произошла ошибка";

      form.setError("password", {
        type: "manual",
        message,
      });

      toast.error(message, { icon: "\u274C" });
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => {
          void form.handleSubmit(onSubmit)(e);
        }}
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
          disabled={!form.formState.isValid}
          className={s.loginBtn}
          type="submit"
        >
          Войти
        </Button>
      </form>
    </FormProvider>
  );
};
