"use client";

import { type FC } from "react";

import { FormInput } from "../FormInput";

import s from "./PersonalForm.module.scss";

export const PersonalForm: FC = () => {
  return (
    <div className={s.root}>
      <FormInput
        name="firstName"
        label="Имя"
        placeholder="Александр"
        required
      />
      <FormInput
        name="lastName"
        label="Фамилия"
        placeholder="Иванов"
        required
      />
      <FormInput
        name="email"
        label="E-Mail"
        placeholder="user@mail.ru"
        required
      />
      <FormInput name="phone" label="Телефон" placeholder="+7(999)999-99-99" />
    </div>
  );
};
