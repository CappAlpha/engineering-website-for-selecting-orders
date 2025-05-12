"use client";

import { type FC } from "react";

import { FormInput } from "../../../../shared/ui/FormInput";

import s from "./PersonalForm.module.scss";

export const PersonalForm: FC = () => {
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
        required
        inputMode="email"
      />
      <FormInput
        name="phone"
        label="Телефон"
        placeholder="+7(999)999-99-99"
        required
        inputMode="tel"
      />
    </div>
  );
};
