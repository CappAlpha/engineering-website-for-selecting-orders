"use client";

import { StandardTextFieldProps } from "@mui/material";
import { useState, type FC } from "react";
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
    watch,
    formState: { errors },
  } = useFormContext();

  const [isFocused, setIsFocused] = useState(false);

  const errorText = errors[name]?.message as string;
  const value = watch(name);
  const registration = register(name);

  return (
    <div className={s.root}>
      <Input
        label={label}
        required={required}
        error={!!errorText}
        helperText={errorText}
        slotProps={{ inputLabel: { shrink: !!value || isFocused } }}
        {...props}
        {...registration}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          registration.onBlur(e);
        }}
      />
    </div>
  );
};
