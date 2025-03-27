import { type FC } from "react";

import s from "./SortDropdown.module.scss";

export interface Props {
  //
}

export const SortDropdown: FC<Props> = ({}) => {
  return (
    <div className={s.root}>
      Сортировка: <span>рейтингу</span>
    </div>
  );
};
