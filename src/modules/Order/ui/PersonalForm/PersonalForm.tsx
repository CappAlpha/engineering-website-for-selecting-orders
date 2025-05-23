"use client";

import { useMask } from "@react-input/mask";
import { type FC } from "react";

import { FormInput } from "../../../../shared/ui/FormInput";

import s from "./PersonalForm.module.scss";

export const PersonalForm: FC = () => {
  const inputRef = useMask({
    mask: "+7 (___) ___-__-__",
    replacement: { _: /\d/ },
  });

  return (
    <div className={s.root}>
      <FormInput
        name="firstName"
        label="Имя"
        placeholder="Александр"
        required
        inputMode="text"
      />
      <FormInput
        name="lastName"
        label="Фамилия"
        placeholder="Иванов"
        required
        inputMode="text"
      />
      <FormInput
        name="email"
        label="E-Mail"
        placeholder="user@mail.ru"
        type="email"
        required
        inputMode="email"
        autoComplete="email"
      />
      <FormInput
        inputRef={inputRef}
        name="phone"
        label="Телефон"
        placeholder="+7 (999) 999-99-99"
        type="tel"
        required
        inputMode="tel"
        autoComplete="tel"
      />
    </div>
  );
};
