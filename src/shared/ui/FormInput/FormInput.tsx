"use client";

import { StandardTextFieldProps } from "@mui/material";
import { ForwardedRef, useState, type FC } from "react";
import { useFormContext } from "react-hook-form";

import { Input } from "@/shared/ui/Input";

interface Props extends Omit<StandardTextFieldProps, "ref"> {
  name: string;
  label?: string;
  required?: boolean;
  inputRef?: ForwardedRef<HTMLInputElement> | ((el: HTMLInputElement) => void);
}

export const FormInput: FC<Props> = ({
  name,
  label,
  required = false,
  inputRef,
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

  // Function to handle ref merging
  const handleRef = (el: HTMLInputElement) => {
    if (inputRef && el) {
      if (typeof inputRef === "function") {
        inputRef(el);
      } else if (inputRef.current !== undefined) {
        inputRef.current = el;
      }
    }
    registration.ref(el);
  };

  return (
    <Input
      label={label}
      required={required}
      error={!!errorText}
      helperText={errorText}
      slotProps={{ inputLabel: { shrink: !!value || isFocused } }}
      inputRef={handleRef}
      name={name}
      onChange={registration.onChange}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        setIsFocused(false);
        registration.onBlur(e);
      }}
      {...props}
    />
  );
};
