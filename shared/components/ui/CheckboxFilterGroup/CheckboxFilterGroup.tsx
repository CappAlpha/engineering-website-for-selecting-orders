"use client";
import { ChangeEvent, useState, type FC } from 'react';

import { Input } from '../Input';
import { Button } from '../Button';
import { FilterCheckbox, Props as FilterCheckboxProps } from "../FilterCheckbox/FilterCheckbox"

import s from './CheckboxFilterGroup.module.scss';

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
  const [searchValue, setSearchValue] = useState('');

  const onChangeShowAll = () => {
    setShowAll((prev) => !prev);
  }

  const onChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }

  const filteredItems = items.filter((item) => item.text.toLowerCase().includes(searchValue.toLowerCase()));

  const list = showAll ? filteredItems : items.slice(0, limit);

  return (
    <div className={s.root}>
      <p className={s.title}>{title}</p>

      {showAll && <div className={s.input}>
        <Input onChange={onChangeSearchInput} placeholder={searchInputPlaceholder} />
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
        <Button onClick={onChangeShowAll} color='transparent' noPadding>
          {showAll ? 'Скрыть' : '+ Показать всё'}
        </Button>
      )}
    </div>
  );
};