"use client";

import { type FC } from "react";

import { FormInput } from "../FormInput";

import s from "./PersonalInformation.module.scss";

export const PersonalInformation: FC = () => {
  return (
    <div className={s.root}>
      <FormInput label="Имя" placeholder="Александр" type="text" />
      <FormInput label="Фамилия" placeholder="Иванов" type="text" />
      <FormInput label="E-Mail" placeholder="user@mail.ru" type="email" />
      <FormInput label="Телефон" placeholder="+7(999)999-99-99" type="tel" />
    </div>
  );
};
