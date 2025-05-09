"use client";

import { HTMLProps, useId, type FC } from "react";
import { AddressSuggestions } from "react-dadata";

import { Input } from "../Input";

import s from "./AddressInput.module.scss";

interface Props extends HTMLProps<HTMLInputElement> {
  label?: string;
  errorText?: string;
  onInputChange: (value?: string) => void;
}

export const AddressInput: FC<Props> = (
  { label, errorText, onInputChange },
  ...inputProps
) => {
  const id = useId();
  return (
    <div className={s.root}>
      {label && (
        <label htmlFor={"address"} className={s.label}>
          {label}
        </label>
      )}

      <AddressSuggestions
        token={process.env.NEXT_PUBLIC_DADATA_TOKEN ?? ""}
        onChange={(data) => onInputChange?.(data?.value)}
        customInput={Input}
        delay={300}
        count={5}
        {...inputProps}
        uid={id}
      />

      {errorText && <p className={s.error}>{errorText}</p>}
    </div>
  );
};
