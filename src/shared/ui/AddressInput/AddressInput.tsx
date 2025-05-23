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

export const AddressInput: FC<Props> = ({
  label,
  errorText,
  onInputChange,
  ...inputProps
}) => {
  const id = useId();

  return (
    <div className={s.root}>
      <AddressSuggestions
        token={process.env.NEXT_PUBLIC_DADATA_TOKEN ?? ""}
        onChange={(data) => onInputChange(data?.value ?? "")}
        delay={200}
        count={5}
        inputProps={{ id, label, ...inputProps }}
        customInput={Input}
        uid={id}
      />

      {errorText && <p className={s.error}>{errorText}</p>}
    </div>
  );
};
