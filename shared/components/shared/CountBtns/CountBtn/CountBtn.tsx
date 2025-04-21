import cn from "classnames";
import { type FC } from "react";

import { Button } from "@/components/ui/Button";

import { Minus, Plus } from "../../../../../public/icon";

import s from "./CountBtn.module.scss";

export interface Props {
  value: number;
  size?: "sm" | "lg";
  type: "minus" | "plus";
  onClick?: () => void;
}
export const CountBtn: FC<Props> = ({ value, type, size = "sm", onClick }) => {
  return (
    <div className={s.root}>
      {type === "minus" ? (
        <Button
          className={cn(s.btnMinus, size && s[`size_${size}`])}
          onClick={onClick}
          disabled={value === 1}
          color="outline"
          noPadding
        >
          <Minus className={s.icon} />
        </Button>
      ) : (
        <Button
          className={cn(s.btnPlus, size && s[`size_${size}`])}
          onClick={onClick}
          color="outline"
          noPadding
        >
          <Plus className={s.icon} />
        </Button>
      )}
    </div>
  );
};
