import { InputHTMLAttributes, type FC } from "react";
import { Input as InputMui } from "@mui/material";
import s from "./Input.module.scss";
import cn from "classnames";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input: FC<InputProps> = ({ className, ...props }) => {
  return <InputMui className={cn(s.root, className)} inputProps={props} fullWidth />;
};
