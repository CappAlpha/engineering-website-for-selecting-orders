import { InputProps as MuiInputProps } from "@mui/material";
import { type FC } from "react";

import { Input } from "@/shared/ui/Input";

import s from "./FormInput.module.scss";

interface Props extends MuiInputProps {
  label?: string;
  required?: boolean;
}

export const FormInput: FC<Props> = ({
  label,
  required = false,
  ...inputProps
}) => {
  return (
    <div className={s.wrapper}>
      {label && (
        <label htmlFor={inputProps.id} className={s.label}>
          {label} {required && <span className={s.required}>*</span>}
        </label>
      )}
      <Input {...inputProps} />
    </div>
  );
};
