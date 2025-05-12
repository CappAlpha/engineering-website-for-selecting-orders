import { type FC } from "react";

import s from "./EmailErrorTemplate.module.scss";

export const EmailErrorTemplate: FC = () => {
  return (
    <div className={s.root}>
      <p>Ошибка оформления заказа! Попробуй ещё раз</p>
    </div>
  );
};
