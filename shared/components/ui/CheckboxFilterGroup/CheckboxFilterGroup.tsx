"use client";
import { useState, type FC } from 'react';

import { FilterCheckbox, Props as FilterCheckboxProps } from "../FilterCheckbox/FilterCheckbox"

import s from './CheckboxFilterGroup.module.scss';
import { Input } from '../Input';
import { Button } from '../Button';

type Item = FilterCheckboxProps;

export interface Props {
  title: string;
  items: Item[];
  limit: number;
  searchInputPlaceholder?: string;
  onChange?: (values: string[]) => void;
  defaultValue?: string[];
}

export const CheckboxFilterGroup: FC<Props> = ({
  title,
  items,
  limit = 5,
  searchInputPlaceholder = "Поиск...",
  onChange,
  defaultValue
}) => {
  const [showAll, setShowAll] = useState(false);

  const list = showAll ? items : items.slice(0, limit);
  return (
    <div className={s.root}>
      <p className={s.title}>{title}</p>

      {showAll && <div className={s.input}>
        <Input placeholder={searchInputPlaceholder} />
      </div>}

      <div className={s.items}>
        {list.map((item) =>
          <FilterCheckbox
            key={item.text}
            text={item.text}
            value={item.value}
            endAdornment={item.endAdornment}
            checked={false}
            onCheckedChange={(ids) => console.log(ids)}
          />
        )}
      </div>

      {items.length > limit && (
        <div>
          <Button onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Скрыть' : 'Показать всё'}
          </Button>
        </div>
      )}
    </div>
  );
};