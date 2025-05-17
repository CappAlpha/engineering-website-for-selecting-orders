"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/shared/ui/Button";
import { FormInput } from "@/shared/ui/FormInput";

import { Login } from "../../../../../public/icon";
import { formRegisterSchema, TFormRegisterValues } from "../../schemas/schemas";

import s from "./RegisterForm.module.scss";

export const RegisterForm: FC = () => {
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
    // try {
    //   toast.success("Вы успешно зарегистрировались!", {
    //     icon: "\u2705",
    //   });

    //   onClose();
    // } catch (err) {
    //   console.error("[Error [REGISTRATION]]", err);
    //   toast.error("Не удалось зарегистрироваться", { icon: "\u274C" });
    // }
    console.log(data);
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
            <h6 className={s.title}>Регистрация</h6>
            <p className={s.description}>
              Заполните поля, чтобы зарегистрироваться
            </p>
          </div>
          <Login className={s.loginIcon} />
        </div>

        <FormInput
          name="fullName"
          label="Ваше имя и фамилия"
          type="text"
          required
        />
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
