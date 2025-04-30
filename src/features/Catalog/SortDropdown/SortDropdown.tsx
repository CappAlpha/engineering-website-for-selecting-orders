"use client";

import { type FC } from "react";

import { Sort } from "../../../../public/icon";

import s from "./SortDropdown.module.scss";

export const SortDropdown: FC = () => {
  return (
    <div className={s.root}>
      <Sort className={s.icon} />
      Сортировка: <span className={s.select}>рейтингу</span>
    </div>
  );
};
