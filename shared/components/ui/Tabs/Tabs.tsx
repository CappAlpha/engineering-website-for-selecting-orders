import s from "./Tabs.module.scss";
import { type FC } from "react";
import { Tab } from "./Tab";
export interface Props {
  items: string[];
  activeIndex: number;
}

export const Tabs: FC<Props> = ({ items, activeIndex }) => {
  return (
    <div className={s.root}>
      {items.map((item, index) => (
        <Tab
          key={item}
          name={item}
          activeIndex={activeIndex}
          currentIndex={index + 1}
        />
      ))}
    </div>
  );
};
