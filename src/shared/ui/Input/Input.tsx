import { TextField, TextFieldProps } from "@mui/material";
import { forwardRef } from "react";

import s from "./Input.module.scss";

export const Input = forwardRef<HTMLInputElement, TextFieldProps>(
  (props, ref) => {
    return (
      <TextField
        className={s.root}
        inputRef={ref}
        fullWidth
        variant="filled"
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
