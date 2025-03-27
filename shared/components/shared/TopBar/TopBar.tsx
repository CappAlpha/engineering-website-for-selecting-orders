import { type FC } from 'react';

import { Tabs } from '@/components/ui/Tabs';
import { SortDropdown } from '../SortDropdown';

import s from './TopBar.module.scss';

export interface Props {
  //
}

export const TopBar: FC<Props> = ({ }) => {
  return (
    <div className={s.root}>
      <div className={s.wrap}>
        <Tabs />
        <SortDropdown />
      </div>
    </div>
  );
};