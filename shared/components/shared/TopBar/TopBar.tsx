"use client";
import { type FC } from 'react';

import { Tabs } from '@/components/ui/Tabs';
import { SortDropdown } from '../SortDropdown';
import { useAppSelector } from '@/hook/useAppSelector';

import s from './TopBar.module.scss';

export interface Props {
  //
}

const ORDERS = ["Чертежи", "БЭМ", "Геология"];

export const TopBar: FC<Props> = ({ }) => {
  const activeIndex = useAppSelector((state) => state.categories.activeId);

  return (
    <div className={s.root}>
      <div className={s.wrap}>
        <Tabs items={ORDERS} activeIndex={activeIndex} />
        <SortDropdown />
      </div>
    </div>
  );
};