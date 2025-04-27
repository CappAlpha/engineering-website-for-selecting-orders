"use client";

import { ChangeEvent, useState, type FC } from "react";

import { Button } from "../../../ui/Button";
import { Input } from "../../../ui/Input";
import { FilterCheckbox } from "./FilterCheckbox";

import s from "./CheckboxFilterGroup.module.scss";

//TODO: refactor component
export interface Props {
  title: string;
  items: string[];
  selected?: string[];
  limit: number;
  loading?: boolean;
  error?: boolean;
  searchInputPlaceholder?: string;
  onClickCheckbox?: (value: string) => void;
  resetFilters: () => void;
}

export const CheckboxFilterGroup: FC<Props> = ({
  title,
  items,
  limit = 5,
  selected,
  loading = false,
  error = false,
  searchInputPlaceholder = "Поиск...",
  onClickCheckbox,
  resetFilters,
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

  console.log("CheckboxFilterGroup render:", {
    items: list,
    selected: [...(selected || [])],
  });

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

      {error ? (
        <>
          <p>Ошибка загрузки тегов</p>
          <Button className={s.retry} onClick={resetFilters}>
            Повторить
          </Button>
        </>
      ) : (
        <>
          <div className={s.items}>
            {loading
              ? Array(limit)
                  .fill(0)
                  .map((_, index) => <li key={index}>Загрузка...</li>)
              : list.map((name) => (
                  <FilterCheckbox
                    key={name}
                    name={name}
                    checked={selected?.includes(name) ?? false}
                    onCheckedChange={() => onClickCheckbox?.(name)}
                  />
                ))}
          </div>
          {loading ? (
            <p>Загрузка...</p>
          ) : (
            items.length > limit && (
              <Button onClick={onChangeShowAll} color="transparent" noPadding>
                {showAll ? "Скрыть" : "+ Показать всё"}
              </Button>
            )
          )}
        </>
      )}
    </div>
  );
};
