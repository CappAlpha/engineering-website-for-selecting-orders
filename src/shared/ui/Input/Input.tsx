import { Input as MuiInput } from "@mui/material";
import { FC, InputHTMLAttributes } from "react";

import s from "./Input.module.scss";

export const Input: FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return <MuiInput className={s.root} inputProps={props} fullWidth />;
};
