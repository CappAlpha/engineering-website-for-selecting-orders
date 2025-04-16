import {
  Input as MuiInput,
  type InputProps as MuiInputProps,
} from "@mui/material";
import { forwardRef, InputHTMLAttributes } from "react";
import s from "./Input.module.scss";

export const Input = forwardRef<
  MuiInputProps,
  InputHTMLAttributes<HTMLInputElement>
>(({ ...props }, ref) => {
  return (
    <MuiInput
      className={s.root}
      inputProps={props as InputHTMLAttributes<HTMLInputElement>}
      fullWidth
      ref={ref}
    />
  );
});

Input.displayName = "Input";
