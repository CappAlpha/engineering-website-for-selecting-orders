"use client";

import { ChangeEvent, useMemo, useState, type FC } from "react";

import { Button } from "../../../ui/Button";
import { Input } from "../../../ui/Input";
import { FilterCheckbox } from "./FilterCheckbox";

import s from "./CheckboxFilterGroup.module.scss";

export interface Props {
  title: string;
  items: string[];
  limit?: number;
  selected?: string[];
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
  loading,
  error,
  searchInputPlaceholder = "Поиск...",
  onClickCheckbox,
  resetFilters,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const onChangeShowAll = () => {
    setShowAll((prev) => !prev);
    setSearchValue("");
  };

  const onChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const visibleItems = useMemo(() => {
    if (showAll) return filteredItems;
    return filteredItems.slice(0, limit);
  }, [showAll, filteredItems, limit]);

  // TODO: fix?
  const canShowToggle = loading ? true : items.length > limit;

  return (
    <div className={s.root}>
      <h5 className={s.title}>{title}</h5>

      {showAll && (
        <div className={s.input}>
          <Input
            onChange={onChangeSearchInput}
            placeholder={searchInputPlaceholder}
            value={searchValue}
            aria-label="Поиск по фильтрам"
            autoFocus
          />
        </div>
      )}

      {error ? (
        <>
          <p className={s.errorMessage}>Ошибка загрузки тегов</p>
          <Button className={s.retry} onClick={resetFilters}>
            Повторить
          </Button>
        </>
      ) : (
        <>
          <ul className={s.items}>
            {loading ? (
              Array.from({ length: limit }).map((_, index) => (
                <li key={index} className={s.itemSkeleton}></li>
              ))
            ) : visibleItems.length > 0 ? (
              visibleItems.map((name) => (
                <FilterCheckbox
                  key={name}
                  name={name}
                  checked={selected?.includes(name) ?? false}
                  onCheckedChange={() => onClickCheckbox?.(name)}
                />
              ))
            ) : (
              <li className={s.noResults}>Ничего не найдено :(</li>
            )}
          </ul>
          {canShowToggle &&
            (loading ? (
              <div className={s.btnSkeleton} />
            ) : (
              <Button onClick={onChangeShowAll} color="transparent" noPadding>
                {showAll ? "Скрыть" : "+ Показать всё"}
              </Button>
            ))}
        </>
      )}
    </div>
  );
};
