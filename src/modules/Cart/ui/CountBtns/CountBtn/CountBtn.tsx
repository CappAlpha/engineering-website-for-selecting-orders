import cn from "classnames";
import { type FC } from "react";

import {
  QuantityActionType,
  QuantityAction,
} from "@/modules/Cart/constants/cart";
import { Button } from "@/shared/ui/Button";

import { Minus, Plus } from "../../../../../../public/icon";

import s from "./CountBtn.module.scss";

interface Props {
  value: number;
  minValue?: number;
  maxValue?: number;
  type: QuantityActionType;
  size?: "sm" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onChangeCount: (type: QuantityActionType) => void;
}
export const CountBtn: FC<Props> = ({
  value,
  minValue = 1,
  maxValue = 10,
  type,
  size = "sm",
  disabled = false,
  loading = false,
  onChangeCount,
}) => {
  const isMinus = type === QuantityAction.MINUS;
  const isDisabled =
    disabled || loading || (isMinus ? value <= minValue : value >= maxValue);

  return (
    <div className={s.root}>
      <Button
        className={cn(
          isMinus ? s.btnMinus : s.btnPlus,
          size && s[`size_${size}`],
        )}
        onClick={() =>
          onChangeCount(isMinus ? QuantityAction.MINUS : QuantityAction.PLUS)
        }
        disabled={isDisabled}
        color="outline"
        noPadding
        aria-label={
          isMinus
            ? "Понизить количество товаров"
            : "Повысить количество товаров"
        }
      >
        {isMinus ? <Minus className={s.icon} /> : <Plus className={s.icon} />}
      </Button>
    </div>
  );
};
