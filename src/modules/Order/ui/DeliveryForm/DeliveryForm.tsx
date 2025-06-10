"use client";

import { type FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { AddressInput } from "@/shared/ui/AddressInput";
import { Selector } from "@/shared/ui/Selector";

import { FormInput } from "../../../../shared/ui/FormInput";
import { TimeRange } from "../../constants/order";

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
            className={s.input}
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
        className={s.input}
      />

      <Controller
        name="time"
        control={control}
        render={({ field, fieldState }) => (
          <Selector
            title="Время доставки заказа"
            id="time"
            field={field}
            items={TimeRange}
            error={fieldState.error}
            className={s.input}
          />
        )}
      />
    </div>
  );
};
