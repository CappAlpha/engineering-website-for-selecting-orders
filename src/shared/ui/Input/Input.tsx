import { TextField, TextFieldProps } from "@mui/material";
import { forwardRef, HTMLProps } from "react";

import s from "./Input.module.scss";

export const Input = forwardRef<HTMLProps<HTMLInputElement>, TextFieldProps>(
  (props, ref) => {
    return (
      <TextField
        className={s.root}
        inputRef={ref}
        {...props}
        fullWidth
        variant="filled"
      />
    );
  },
);

Input.displayName = "Input";
