import cn from "classnames";
import { type FC } from "react";

import { Tag } from "./Tag";

import s from "./Tags.module.scss";

interface Props {
  tags: string[];
  className?: string;
}

export const Tags: FC<Props> = ({ tags, className }) => {
  return (
    <div className={cn(s.root, className)}>
      {tags.map((tag) => (
        <Tag key={tag} tag={tag} />
      ))}
    </div>
  );
};
