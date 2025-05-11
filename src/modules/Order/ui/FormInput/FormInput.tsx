"use client";

import { InputProps as MuiInputProps } from "@mui/material";
import { type FC } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

import { Plus } from "../../../../../public/icon";

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
    watch,
    setValue,
  } = useFormContext();

  const value = watch(name);
  const errorText = errors[name]?.message as string;

  const onClickClear = () => {
    setValue(name, "", { shouldValidate: true });
  };

  return (
    <div className={s.root}>
      {label && (
        <label htmlFor={inputProps.id} className={s.label}>
          {label} {required && <span className={s.required}>*</span>}
        </label>
      )}
      <Input {...register(name)} {...inputProps} />

      {value && (
        <Button
          color="transparent"
          onClick={onClickClear}
          noPadding
          className={s.clearBtn}
        >
          <Plus className={s.clear} />
        </Button>
      )}
      {errorText && <p className={s.error}>{errorText}</p>}
    </div>
  );
};
