"use client";

import { type FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { AddressInput } from "@/shared/ui/AddressInput";

import { FormInput } from "../../../../shared/ui/FormInput";

import s from "./DeliveryForm.module.scss";

export const DeliveryForm: FC = () => {
  const { control } = useFormContext();

  return (
    <div className={s.root}>
      <Controller
        control={control}
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

      <FormInput
        name="comment"
        label="Комментарий к заказу"
        placeholder="Укажите тут дополнительную информацию для курьера"
        multiline
        rows={8}
        inputMode="text"
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
