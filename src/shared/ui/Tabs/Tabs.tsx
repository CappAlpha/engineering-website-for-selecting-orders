import cn from "classnames";
import { type FC } from "react";

import { TopBarProps } from "@/modules/Catalog/ui/TopBar";

import { Tab } from "./Tab";

import s from "./Tabs.module.scss";

interface Props {
  items: TopBarProps["categories"];
  activeId: string | null;
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
      {items.map((item) => (
        <Tab
          key={item.name}
          name={item.name}
          activeId={activeId}
          onClick={onClick}
        />
      ))}
    </div>
  );
};
