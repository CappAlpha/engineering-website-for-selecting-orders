"use client";

import { type FC } from "react";

import { FormInput } from "../FormInput";

import s from "./DeliveryForm.module.scss";

export const DeliveryForm: FC = () => {
  return (
    <div className={s.root}>
      <FormInput
        name="address"
        label="Введите адрес"
        placeholder="Москва, ул. Мира 12"
      />
      <FormInput
        name="commentary"
        label="Комментарий к заказу"
        placeholder="Укажите тут дополнительную информацию для курьера"
        multiline
        rows={8}
      />
      {/* TODO: add choose time? */}
      {/*  <FormInput
        name="time"
        label="Время доставки заказа"
        placeholder="Укажите тут дополнительную информацию для курьера"
      /> */}
    </div>
  );
};
