import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import cn from "classnames";
import {
  ControllerRenderProps,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";

import s from "./Selector.module.scss";

interface Props<
  T,
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> {
  title: string;
  id: string;
  field: ControllerRenderProps<TFieldValues, TName>;
  items: Array<T>;
  error: FieldError | undefined;
  className?: string;
  isSubmitting?: boolean;
  isRequired?: boolean;
}

export const Selector = <
  T extends { id: number; name: string; slug: string },
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
>({
  title,
  id,
  field,
  items,
  error,
  className,
  isSubmitting = false,
  isRequired = false,
}: Props<T, TFieldValues, TName>) => {
  return (
    <div className={cn(s.root, className)}>
      <FormControl fullWidth error={!!error} disabled={isSubmitting} required>
        <InputLabel id={id} required={isRequired}>
          {title}
        </InputLabel>
        <Select {...field} labelId={id} label={title} required>
          {items.map(({ id, name, slug }) => (
            <MenuItem key={id} value={name + "," + slug}>
              {name}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText id={id}>{error.message}</FormHelperText>}
      </FormControl>
    </div>
  );
};
