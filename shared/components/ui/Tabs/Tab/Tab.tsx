import cn from "classnames";
import { type FC } from "react";

import { Button } from "@/components/ui/Button";

import s from "./Tab.module.scss";

interface Props {
  name: string;
  activeId: string;
  onClick: (name: string, isActive: boolean) => void;
}

export const Tab: FC<Props> = ({ name, activeId, onClick }) => {
  const isActive = name == activeId;
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
