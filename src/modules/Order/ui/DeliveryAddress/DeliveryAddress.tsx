"use client";

import { type FC } from "react";

import { FormInput } from "../FormInput";

import s from "./DeliveryAddress.module.scss";

export const DeliveryAddress: FC = () => {
  return (
    <div className={s.root}>
      <FormInput label="Введите адрес" placeholder="Москва, ул. Мира 12" />
      <FormInput
        label="Комментарий к заказу"
        placeholder="Укажите тут дополнительную информацию для курьера"
      />
    </div>
  );
};
