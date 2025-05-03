import { Input as MuiInput, InputProps as MuiInputProps } from "@mui/material";
import { FC } from "react";

import s from "./Input.module.scss";

interface Props extends MuiInputProps {
  label?: string;
}

export const Input: FC<Props> = ({ label, ...inputProps }) => {
  return (
    <div className={s.wrapper}>
      {label && (
        <label htmlFor={inputProps.id} className={s.label}>
          {label}
        </label>
      )}
      <MuiInput className={s.root} {...inputProps} fullWidth />
    </div>
  );
};
