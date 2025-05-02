import {
  Input as MuiInput,
  type InputProps as MuiInputProps,
} from "@mui/material";
import { FC, InputHTMLAttributes } from "react";

import s from "./Input.module.scss";

export const Input: FC<
  MuiInputProps & InputHTMLAttributes<HTMLInputElement>
> = (props) => {
  return (
    <MuiInput
      className={s.root}
      inputProps={props as InputHTMLAttributes<HTMLInputElement>}
      fullWidth
    />
  );
};
