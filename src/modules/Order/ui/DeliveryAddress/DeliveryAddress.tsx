"use client";

import { type FC } from "react";

import { Input } from "@/shared/ui/Input";

import s from "./DeliveryAddress.module.scss";

export const DeliveryAddress: FC = () => {
  return (
    <div className={s.root}>
      <Input label="Введите адрес" placeholder="Москва, ул. Мира 12" />
      <Input
        label="Комментарий к заказу"
        placeholder="Укажите тут дополнительную информацию для курьера"
      />
    </div>
  );
};
