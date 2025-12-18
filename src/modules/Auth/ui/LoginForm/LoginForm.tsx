"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useEffect, useRef, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useCartQueries } from "@/modules/Cart/hooks/useCartQueries";
import { Button } from "@/shared/ui/Button";
import { FormInput } from "@/shared/ui/FormInput";

import type { TFormLoginValues } from "../../schemas/authSchemas";
import { formLoginSchema } from "../../schemas/authSchemas";
import { ShowPasswordInput } from "../ShowPasswordInput";

import s from "./LoginForm.module.scss";

interface Props {
  onClose: VoidFunction;
}

const COOLDOWN_MS = 1000;

export const LoginForm: FC<Props> = ({ onClose }) => {
  const form = useForm<TFormLoginValues>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { refetchCart } = useCartQueries();

  const lastFailedAtRef = useRef<number | null>(null);
  const submittingRef = useRef(false);

  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      emailRef.current?.focus();
    });
  }, []);

  const inCooldown =
    lastFailedAtRef.current !== null &&
    Date.now() - lastFailedAtRef.current < COOLDOWN_MS;

  const onSubmit = async (data: TFormLoginValues) => {
    if (submittingRef.current) {
      return;
    }

    if (inCooldown) {
      form.setError("password", {
        type: "manual",
        message: "Слишком частые попытки попробуйте позже",
      });
      return;
    }

    submittingRef.current = true;
    try {
      const resp = await signIn("credentials", { ...data, redirect: false });

      if (!resp?.ok) {
        if (String(resp?.error).includes("CredentialsSignin")) {
          form.setError("password", {
            type: "manual",
            message: "Неправильная почта или пароль",
          });
        } else {
          form.setError("password", {
            type: "manual",
            message: resp?.error ?? "SignIn error",
          });
        }

        lastFailedAtRef.current = Date.now();
        throw new Error(resp?.error ?? "SignIn error");
      }

      toast.success("Вы успешно вошли в аккаунт!", {
        icon: "\u2705",
      });

      await refetchCart();
      onClose();
    } catch (err) {
      console.error("[Error [LOGIN]]", err);
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
          inputRef={emailRef}
        />

        <ShowPasswordInput />

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
          disabled={form.formState.isSubmitting}
        >
          Войти
        </Button>
      </form>
    </FormProvider>
  );
};
