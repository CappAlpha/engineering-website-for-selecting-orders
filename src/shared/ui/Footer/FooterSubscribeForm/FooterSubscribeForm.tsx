"use client";

import { type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { noop } from "@/shared/utils/noop";

import { Button } from "../../Button";
import { FormInput } from "../../FormInput";

import s from "./FooterSubscribeForm.module.scss";

export const FooterSubscribeForm: FC = () => {
  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  return (
    <FormProvider {...form}>
      <form className={s.root} onSubmit={noop} noValidate>
        <FormInput
          name="email"
          type="email"
          placeholder="Ваш email"
          fullWidth
          required
        />
        <Button type="submit" className={s.btn}>
          Подписаться
        </Button>
      </form>
    </FormProvider>
  );
};
