"use client";

import { StandardTextFieldProps } from "@mui/material";
import { type FC } from "react";
import { useFormContext } from "react-hook-form";

import { Input } from "@/shared/ui/Input";

import s from "./FormInput.module.scss";

interface Props extends StandardTextFieldProps {
  name: string;
  label?: string;
  required?: boolean;
}

export const FormInput: FC<Props> = ({
  name,
  label,
  required = false,
  ...props
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const errorText = errors[name]?.message as string;

  return (
    <div className={s.root}>
      <Input
        label={label}
        required={required}
        error={!!errorText}
        helperText={errorText}
        {...props}
        {...register(name)}
      />
    </div>
  );
};
