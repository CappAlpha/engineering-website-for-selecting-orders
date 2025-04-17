"use client";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import s from "./FilterCheckbox.module.scss";
import { ReactNode, type FC } from "react";
import { noop } from "@/utils/noop";
import classNames from "classnames";

export interface Props {
  name: string;
  endAdornment?: ReactNode;
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
}

export const FilterCheckbox: FC<Props> = ({
  name,
  endAdornment = null,
  onCheckedChange,
  checked = false,
}) => {
  return (
    <FormGroup className={classNames(s.root, checked && s.checked)}>
      <FormControlLabel
        control={
          <Checkbox
            id={`checkbox-${String(name)}`}
            onChange={onCheckedChange ?? noop}
            checked={checked}
            value={name}
          />
        }
        label={name}
      />
      {endAdornment}
    </FormGroup>
  );
};
