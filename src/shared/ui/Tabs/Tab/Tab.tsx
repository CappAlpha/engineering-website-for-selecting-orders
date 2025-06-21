import cn from "classnames";
import { type FC } from "react";

import { Button } from "../../Button";

import s from "./Tab.module.scss";

interface Props {
  name: string;
  isActive: boolean;
  onClick: (name: string, isActive: boolean) => void;
}

export const Tab: FC<Props> = ({ name, isActive, onClick }) => {
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
