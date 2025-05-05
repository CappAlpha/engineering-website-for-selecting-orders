"use client";

import { InputProps as MuiInputProps } from "@mui/material";
import { type FC } from "react";
import { useFormContext } from "react-hook-form";

import { Input } from "@/shared/ui/Input";

import s from "./FormInput.module.scss";

interface Props extends MuiInputProps {
  name: string;
  label?: string;
  required?: boolean;
}

export const FormInput: FC<Props> = ({
  name,
  label,
  required = false,
  ...inputProps
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const errorText = errors[name]?.message as string;

  return (
    <div className={s.root}>
      {label && (
        <label htmlFor={inputProps.id} className={s.label}>
          {label} {required && <span className={s.required}>*</span>}
        </label>
      )}
      <Input {...register(name)} {...inputProps} />

      {errorText && <p className={s.error}>{errorText}</p>}
    </div>
  );
};
