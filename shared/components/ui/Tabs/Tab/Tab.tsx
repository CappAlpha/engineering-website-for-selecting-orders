import { Button } from "@/components/ui/Button";
import s from "./Tab.module.scss";
import { type FC } from "react";
import cn from "classnames";

export interface Props {
  name: string;
  activeIndex: number;
  currentIndex: number;
}

export const Tab: FC<Props> = ({ name, activeIndex, currentIndex }) => {
  const isActive = activeIndex == currentIndex;
  return (
    <Button
      href={`/#${name}`}
      disabled={isActive}
      size="s"
      className={cn(s.root, isActive && s.active)}
    >
      {name}
    </Button>
  );
};
