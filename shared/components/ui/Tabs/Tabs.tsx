import cn from "classnames";
import { type FC } from "react";

import { TopBarProps } from "@/components/shared/TopBar";

import { Tab } from "./Tab";

import s from "./Tabs.module.scss";

export interface Props {
  items: TopBarProps["categories"];
  activeId: number;
  loading?: boolean;
  onClick: (name: string, isActive: boolean) => void;
}

export const Tabs: FC<Props> = ({
  items,
  activeId,
  loading = false,
  onClick,
}) => {
  return (
    <div className={cn(s.root, loading && s.rootSkeleton)}>
      {items.map((item, index) => (
        <Tab
          key={item.name}
          name={item.name}
          activeIndex={activeId}
          currentIndex={index + 1}
          onClick={onClick}
        />
      ))}
    </div>
  );
};
