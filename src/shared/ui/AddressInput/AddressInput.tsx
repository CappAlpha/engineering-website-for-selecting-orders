"use client";

import cn from "classnames";
import { HTMLProps, useId, type FC } from "react";
import { AddressSuggestions } from "react-dadata";

import { Input } from "../Input";

import sInput from "../Input/Input.module.scss";
import s from "./AddressInput.module.scss";

interface Props extends HTMLProps<HTMLInputElement> {
  errorText?: string;
  onInputChange: (value?: string) => void;
}

export const AddressInput: FC<Props> = ({
  errorText,
  onInputChange,
  value,
  ...inputProps
}) => {
  const id = useId();
  return (
    <div className={cn(sInput.root, s.addressList)}>
      <AddressSuggestions
        token={process.env.NEXT_PUBLIC_DADATA_TOKEN ?? ""}
        onChange={(data) => onInputChange(data?.value ?? "")}
        delay={200}
        count={5}
        customInput={Input}
        uid={id}
        defaultQuery={String(value || "")}
        inputProps={{ ...inputProps }}
      />

      {errorText && <p className={s.error}>{errorText}</p>}
    </div>
  );
};
