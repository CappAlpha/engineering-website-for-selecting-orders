import { type FC } from "react";

import s from "./EmailError.module.scss";

export const EmailError: FC = () => {
  return (
    <div className={s.root}>
      <p>Ошибка оформления заказа! Попробуй ещё раз</p>
    </div>
  );
};
