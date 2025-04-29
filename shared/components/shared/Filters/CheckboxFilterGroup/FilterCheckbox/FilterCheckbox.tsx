"use client";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import classNames from "classnames";
import { ReactNode, type FC } from "react";

import { noop } from "@/utils/noop";

import s from "./FilterCheckbox.module.scss";

interface Props {
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
