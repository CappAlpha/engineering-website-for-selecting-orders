import s from "./Tabs.module.scss";
import { type FC } from "react";
import { Tab } from "./Tab";
import { Category } from "@prisma/client";
export interface Props<T> {
  items: T[];
  activeIndex: number;
}

export const Tabs: FC<Props<Pick<Category, "id" | "name">>> = ({ items, activeIndex }) => {
  return (
    <div className={s.root}>
      {items.map((item, index) => (
        <Tab
          key={item.name}
          name={item.name}
          activeIndex={activeIndex}
          currentIndex={index + 1}
        />
      ))}
    </div>
  );
};
