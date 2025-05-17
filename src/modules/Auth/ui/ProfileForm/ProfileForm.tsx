"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { signOut } from "next-auth/react";
import { type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/shared/ui/Button";
import { FormInput } from "@/shared/ui/FormInput";

import { formRegisterSchema, TFormRegisterValues } from "../../schemas/schemas";

import s from "./ProfileForm.module.scss";

interface Props {
  data: User;
}

export const ProfileForm: FC<Props> = ({ data }) => {
  const form = useForm<TFormRegisterValues>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      confirmPassword: "",
    },
  });

  console.log(data);

  const onSubmit = async (data: TFormRegisterValues) => {
    try {
      // await updateUserInfo({
      //   email: data.email,
      //   fullName: data.fullName,
      //   password: data.password,
      // });

      console.log(data);

      toast.success("Вы успешно изменили данные", {
        icon: "\u2705",
      });
    } catch (err) {
      console.error("[Error [CHANGE_USER_DATA]]", err);
      toast.error("Не удалось изменить данные", { icon: "\u274C" });
    }
  };

  const onClickSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
      toast.success("Вы успешно вышли из аккаунта", {
        icon: "\u2705",
      });
    } catch (err) {
      console.error("[Error [SIGN_OUT]]", err);
      toast.error("Не удалось выйти из аккаунта", { icon: "\u274C" });
    }
  };

  return (
    <div className={s.root}>
      <h6 className={s.title}>Личные данные</h6>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={s.form}
          noValidate
        >
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
            label="Подтвердите пароль"
            type="password"
            required
            autoComplete="new-password"
          />

          <Button
            loading={form.formState.isSubmitting}
            className={s.saveBtn}
            type="submit"
          >
            Сохранить
          </Button>
        </form>
      </FormProvider>

      <Button
        loading={form.formState.isSubmitting}
        className={s.exitBtn}
        onClick={onClickSignOut}
      >
        Выйти
      </Button>
    </div>
  );
};
