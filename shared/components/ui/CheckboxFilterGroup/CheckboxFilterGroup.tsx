"use client";

import { ChangeEvent, useState, type FC } from "react";

import { Button } from "../Button";
import { Input } from "../Input";
import { FilterCheckbox } from "./FilterCheckbox";

import s from "./CheckboxFilterGroup.module.scss";

export interface Props {
  title: string;
  items: string[];
  limit: number;
  loading?: boolean;
  searchInputPlaceholder?: string;
  onClickCheckbox?: (value: string) => void;
  selected?: Set<string>;
}

export const CheckboxFilterGroup: FC<Props> = ({
  title,
  items,
  limit = 5,
  loading,
  searchInputPlaceholder = "Поиск...",
  onClickCheckbox,
  selected,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const onChangeShowAll = () => {
    setShowAll((prev) => !prev);
  };

  const onChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const list = showAll ? filteredItems : items.slice(0, limit);

  /* TODO: добавить скелетон */
  const renderLoadingList = loading
    ? Array(limit)
        .fill(0)
        .map((_, index) => <li key={index}>Загрузка...</li>)
    : list.map((name) => (
        <FilterCheckbox
          key={name}
          name={name}
          checked={selected?.has(name) ?? false}
          onCheckedChange={() => onClickCheckbox?.(name)}
        />
      ));

  const renderShowBtn = items.length > limit && (
    <Button onClick={onChangeShowAll} color="transparent" noPadding>
      {showAll ? "Скрыть" : "+ Показать всё"}
    </Button>
  );

  return (
    <div className={s.root}>
      <p className={s.title}>{title}</p>

      {showAll && (
        <div className={s.input}>
          <Input
            onChange={onChangeSearchInput}
            placeholder={searchInputPlaceholder}
          />
        </div>
      )}

      <div className={s.items}>{renderLoadingList}</div>

      {loading ? <p>Загрузка...</p> : renderShowBtn}
    </div>
  );
};
