"use client";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import s from "./FilterCheckbox.module.scss";
import { ReactNode, type FC } from "react";
import { noop } from "@/utils/noop";
import classNames from "classnames";

export interface Props {
  text: string;
  value: string;
  endAdornment?: ReactNode;
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
}

export const FilterCheckbox: FC<Props> = ({
  text,
  value,
  endAdornment,
  onCheckedChange,
  checked,
}) => {
  return (
    <FormGroup className={classNames(s.root, checked && s.checked)}>
      <FormControlLabel
        control={
          <Checkbox
            onChange={onCheckedChange ?? noop}
            checked={checked}
            value={value}
            id={`checkbox-${String(value)}`}
          />
        }
        label={text}
      />
      {endAdornment}
    </FormGroup>
  );
};
