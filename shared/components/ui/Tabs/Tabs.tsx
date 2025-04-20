import { Category } from "@prisma/client";
import { type FC } from "react";

import { Tab } from "./Tab";

import s from "./Tabs.module.scss";

export interface Props {
  items: Category[];
  activeIndex: number;
  onClick: (name: string, isActive: boolean) => void;
}

export const Tabs: FC<Props> = ({ items, activeIndex, onClick }) => {
  return (
    <div className={s.root}>
      {items.map((item, index) => (
        <Tab
          key={item.name}
          name={item.name}
          activeIndex={activeIndex}
          currentIndex={index + 1}
          onClick={onClick}
        />
      ))}
    </div>
  );
};
