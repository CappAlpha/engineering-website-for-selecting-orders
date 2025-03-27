import { type FC } from "react";

import s from "./Tabs.module.scss";
import { Tab } from "./Tab";

export interface Props {
  //
}

const orders = ["Все", "Здания", "Мосты", "Геология"];
const activeIndex = 0;

export const Tabs: FC<Props> = ({}) => {
  return (
    <div className={s.root}>
      {orders.map((order, index) => (
        <Tab
          key={order}
          order={order}
          activeIndex={activeIndex}
          currentIndex={index}
        />
      ))}
    </div>
  );
};
