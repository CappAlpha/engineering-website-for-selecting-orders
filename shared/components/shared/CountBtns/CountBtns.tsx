import { type FC } from "react";

import { QuantityActionType } from "@/constants/cart";

import { CountBtn } from "./CountBtn";

import s from "./CountBtns.module.scss";

interface Props {
  value: number;
  minValue: number;
  maxValue: number;
  size?: "sm" | "lg";
  loading?: boolean;
  onChangeCount: (type: QuantityActionType) => void;
}

export const CountBtns: FC<Props> = ({
  value,
  minValue,
  maxValue,
  loading = false,
  size = "sm",
  onChangeCount,
}) => {
  return (
    <div className={s.root}>
      <CountBtn
        value={value}
        minValue={minValue}
        onChangeCount={onChangeCount}
        size={size}
        loading={loading}
        type="minus"
      />

      <p className={s.count}>{value}</p>

      <CountBtn
        value={value}
        maxValue={maxValue}
        onChangeCount={onChangeCount}
        size={size}
        loading={loading}
        type="plus"
      />
    </div>
  );
};
