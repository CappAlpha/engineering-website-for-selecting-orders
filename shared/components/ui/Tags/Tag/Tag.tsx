import { type FC } from "react";

import s from "./Tag.module.scss";

export interface Props {
  tag: string;
}

export const Tag: FC<Props> = ({ tag }) => {
  return <div className={s.root}>{tag}</div>;
};
