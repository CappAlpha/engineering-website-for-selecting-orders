import { type FC } from "react";

import { QuantityActionType } from "@/constants/cart";

import { CountBtn } from "./CountBtn";

import s from "./CountBtns.module.scss";

export interface Props {
  value?: number;
  size?: "sm" | "lg";
  loading?: boolean;
  onChangeCount: (type: QuantityActionType) => void;
}

export const CountBtns: FC<Props> = ({
  value = 1,
  loading,
  size = "sm",
  onChangeCount,
}) => {
  return (
    <div className={s.root}>
      <CountBtn
        value={value}
        onChangeCount={onChangeCount}
        size={size}
        disabled={loading}
        type="minus"
      />

      <p className={s.count}>{value}</p>

      <CountBtn
        value={value}
        onChangeCount={onChangeCount}
        size={size}
        disabled={loading}
        type="plus"
      />
    </div>
  );
};
