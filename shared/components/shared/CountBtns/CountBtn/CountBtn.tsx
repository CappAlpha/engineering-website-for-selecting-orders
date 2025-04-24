import cn from "classnames";
import { type FC } from "react";

import { Button } from "@/components/ui/Button";
import { QuantityAction, QuantityActionType } from "@/constants/cart";

import { Minus, Plus } from "../../../../../public/icon";

import s from "./CountBtn.module.scss";

export interface Props {
  value: number;
  type: QuantityActionType;
  size?: "sm" | "lg";
  disabled?: boolean;
  onChangeCount: (type: QuantityActionType) => void;
}
export const CountBtn: FC<Props> = ({
  value,
  type,
  size = "sm",
  onChangeCount,
  disabled,
}) => {
  return (
    <div className={s.root}>
      {type === QuantityAction.MINUS ? (
        <Button
          className={cn(s.btnMinus, size && s[`size_${size}`])}
          onClick={() => onChangeCount(QuantityAction.MINUS)}
          disabled={value === 1 || disabled}
          color="outline"
          noPadding
        >
          <Minus className={s.icon} />
        </Button>
      ) : (
        <Button
          className={cn(s.btnPlus, size && s[`size_${size}`])}
          onClick={() => onChangeCount(QuantityAction.PLUS)}
          disabled={disabled}
          color="outline"
          noPadding
        >
          <Plus className={s.icon} />
        </Button>
      )}
    </div>
  );
};
