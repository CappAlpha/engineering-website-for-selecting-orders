import cn from "classnames";
import { type FC } from "react";

import { Button } from "@/components/ui/Button";

import s from "./Tab.module.scss";

export interface Props {
  name: string;
  activeIndex: number;
  currentIndex: number;
  onClick: (name: string, isActive: boolean) => void;
}

export const Tab: FC<Props> = ({
  name,
  activeIndex,
  currentIndex,
  onClick,
}) => {
  const isActive = activeIndex == currentIndex;
  return (
    <Button
      onClick={() => onClick(name, isActive)}
      disabled={isActive}
      size="s"
      className={cn(s.root, isActive && s.active)}
    >
      {name}
    </Button>
  );
};
