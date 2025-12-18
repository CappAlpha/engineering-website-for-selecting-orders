"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useCartQueries } from "@/modules/Cart/hooks/useCartQueries";
import { Button } from "@/shared/ui/Button";
import { FormInput } from "@/shared/ui/FormInput";

import type { TFormLoginValues } from "../../schemas/authSchemas";
import { formLoginSchema } from "../../schemas/authSchemas";

import s from "./LoginForm.module.scss";

interface Props {
  onClose: VoidFunction;
}

const COOLDOWN_MS = 5000;

export const LoginForm: FC<Props> = ({ onClose }) => {
  const form = useForm<TFormLoginValues>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { refetchCart } = useCartQueries();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [lastFailedAt, setLastFailedAt] = useState<number | null>(null);

  const inCooldown =
    lastFailedAt !== null && Date.now() - lastFailedAt < COOLDOWN_MS;

  const onSubmit = async (data: TFormLoginValues) => {
    if (inCooldown) {
      setServerError("Слишком часто. Попробуйте чуть позже.");
      return;
    }

    setServerError(null);

    try {
      const resp = await signIn("credentials", { ...data, redirect: false });

      if (!resp?.ok) {
        // Частый кейс next-auth: CredentialsSignin
        if (String(resp?.error).includes("CredentialsSignin")) {
          // фокусируем поле пароля и показываем понятное сообщение
          form.setError("password", {
            type: "manual",
            message: "Неправильная почта или пароль",
          });
          setServerError("Неправильная почта или пароль");
        } else {
          setServerError(String(resp?.error ?? "Не удалось войти в аккаунт"));
        }

        setLastFailedAt(Date.now());
        throw new Error(resp?.error ?? "SignIn error");
      }

      toast.success("Вы успешно вошли в аккаунт!", {
        icon: "\u2705",
      });

      await refetchCart();
      onClose();
    } catch (err) {
      console.error("[Error [LOGIN]]", err);

      if (serverError) {
        toast.error(serverError, { icon: "\u274C" });
      } else {
        toast.error(
          err instanceof Error ? err.message : "Не удалось войти в аккаунт",
          { icon: "\u274C" },
        );
      }
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
        />

        <div className={s.passwordRow}>
          <FormInput
            name="password"
            label="Пароль"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            inputMode="text"
          />
          <button
            type="button"
            className={s.togglePassword}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? "Скрыть" : "Показать"}
          </button>
        </div>

        {/* <div className={s.optionsRow}>
          <a className={s.forgot} href="/forgot-password">
            Забыли пароль?
          </a>
        </div> */}

        {serverError && (
          <div id="login-server-error" role="alert" className={s.serverError}>
            {serverError}
          </div>
        )}

        <Button
          loading={form.formState.isSubmitting}
          className={s.loginBtn}
          type="submit"
          disabled={form.formState.isSubmitting || inCooldown}
        >
          Войти
        </Button>
      </form>
    </FormProvider>
  );
};
