import { type FC } from "react";

import { CountBtn } from "./CountBtn/CountBtn";

import s from "./CountBtns.module.scss";

export interface Props {
  value?: number;
  size?: "sm" | "lg";
  onClick?: () => void;
}

export const CountBtns: FC<Props> = ({ value = 1, size = "sm", onClick }) => {
  return (
    <div className={s.root}>
      <CountBtn value={value} onClick={onClick} size={size} type="minus" />

      <p className={s.count}>{value}</p>

      <CountBtn value={value} onClick={onClick} size={size} type="plus" />
    </div>
  );
};
