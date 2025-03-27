"use client";
import { type FC } from "react";

import { Sort } from "../../../../public/icon";

import s from "./SortDropdown.module.scss";

export interface Props {
  //
}

export const SortDropdown: FC<Props> = ({ }) => {
  return (
    <div className={s.root}>
      <Sort className={s.icon} />
      Сортировка: <span className={s.select}>рейтингу</span>
    </div>
  );
};
