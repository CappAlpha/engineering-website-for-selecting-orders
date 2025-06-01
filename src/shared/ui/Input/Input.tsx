import { StandardTextFieldProps, TextField } from "@mui/material";
import cn from "classnames";
import { forwardRef } from "react";

import s from "./Input.module.scss";

interface Props extends StandardTextFieldProps {
  paddingSize?: "sm" | "md";
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { paddingSize, className, ...rest } = props;
  return (
    <TextField
      inputRef={ref}
      className={cn(
        s.root,
        className,
        paddingSize && s[`paddingSize_${paddingSize}`],
      )}
      fullWidth
      variant="filled"
      {...rest}
    />
  );
});

Input.displayName = "Input";
