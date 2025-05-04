import { InputProps, Input as MuiInput } from "@mui/material";
import { FC } from "react";

import s from "./Input.module.scss";

export const Input: FC<InputProps> = (props) => {
  return <MuiInput className={s.root} {...props} fullWidth />;
};
