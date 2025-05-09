import { type FC } from "react";

import { Tag } from "./Tag";

import s from "./Tags.module.scss";

interface Props {
  tags: string[];
}

export const Tags: FC<Props> = ({ tags }) => {
  return (
    <div className={s.root}>
      {tags.map((tag) => (
        <Tag key={tag} tag={tag} />
      ))}
    </div>
  );
};
