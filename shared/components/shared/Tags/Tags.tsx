import { type FC } from 'react';

import s from './Tags.module.scss';
import { Tag } from './Tag/Tag';

export interface Props {
  tags: string[];
}

export const Tags: FC<Props> = ({ tags }) => {
  return (
    <div className={s.root}>
      {tags.map((tag) => <Tag key={tag} tag={tag} />)}
    </div>
  );
};