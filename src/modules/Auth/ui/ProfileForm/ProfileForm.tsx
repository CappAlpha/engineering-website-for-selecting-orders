"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type FC } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { updateUserInfo } from "@/app/actions";
import { AddressInput } from "@/shared/ui/AddressInput";
import { Button } from "@/shared/ui/Button";
import { FormInput } from "@/shared/ui/FormInput";

import {
  TFormChangeUserValues,
  formChangeUserSchema,
} from "../../schemas/changeUserSchema";

import s from "./ProfileForm.module.scss";

interface Props {
  data: User;
}

export const ProfileForm: FC<Props> = ({ data }) => {
  const route = useRouter();

  const form = useForm<TFormChangeUserValues>({
    resolver: zodResolver(formChangeUserSchema),
    defaultValues: {
      fullName: data.fullName,
      email: data.email,
      password: "",
      confirmPassword: "",
      phone: data.phone ?? "",
      address: data.address ?? "",
    },
  });

  const onSubmit = async (data: TFormChangeUserValues) => {
    try {
      await updateUserInfo({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
        phone: data.phone,
        address: data.address,
      });

      toast.success("Вы успешно изменили данные", {
        icon: "\u2705",
      });

      route.refresh();
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
      <h1 className={s.title}>Личные данные | {data.fullName}</h1>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={s.form}
          noValidate
        >
          <FormInput
            name="fullName"
            label="Полное имя"
            type="text"
            inputMode="text"
          />
          <FormInput
            name="email"
            label="E-Mail"
            type="email"
            autoComplete="new-email"
            inputMode="email"
          />
          <FormInput
            name="password"
            label="Новый пароль"
            type="password"
            autoComplete="new-password"
            inputMode="text"
          />
          <FormInput
            name="confirmPassword"
            label="Повторите пароль"
            type="password"
            autoComplete="new-password"
            inputMode="text"
          />
          <FormInput
            name="phone"
            label="Телефон"
            placeholder="+7(999)999-99-99"
            inputMode="tel"
          />
          <Controller
            control={form.control}
            name="address"
            render={({ field, fieldState }) => (
              <AddressInput
                onInputChange={field.onChange}
                label="Введите адрес"
                placeholder="Москва, ул. Мира 12"
                inputMode="text"
                errorText={fieldState.error?.message}
                {...field}
              />
            )}
          />

          <div className={s.btns}>
            <Button
              loading={form.formState.isSubmitting}
              className={s.saveBtn}
              type="submit"
            >
              Сохранить
            </Button>

            <div className={s.line} />

            <Button
              onClick={onClickSignOut}
              loading={form.formState.isSubmitting}
              className={s.exitBtn}
            >
              Выйти
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
