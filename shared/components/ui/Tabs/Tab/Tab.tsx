import { type FC } from "react";

import s from "./Tab.module.scss";
import { Button } from "@/components/ui/Button";
import cn from "classnames";

export interface Props {
  order: string;
  activeIndex: number;
  currentIndex: number;
}

export const Tab: FC<Props> = ({ order, activeIndex, currentIndex }) => {
  const isActive = activeIndex == currentIndex;
  return (
    <Button
      href={"#"}
      disabled={isActive}
      size="s"
      className={cn(s.root, isActive && s.active)}
    >
      {order}
    </Button>
  );
};
