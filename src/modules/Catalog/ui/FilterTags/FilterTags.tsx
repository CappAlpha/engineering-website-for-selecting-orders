"use client";

import { ChangeEvent, useState, type FC } from "react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

import { CheckboxFilterGroup } from "../CheckboxFilterGroup";

import s from "./FilterTags.module.scss";

interface Props {
  title: string;
  items: string[];
  searchValue: string;
  limit?: number;
  selected?: string[];
  loading?: boolean;
  error?: boolean;
  searchInputPlaceholder?: string;
  onClickCheckbox?: (value: string) => void;
  resetFilters: () => void;
  setSearchValue: (value: string) => void;
}

export const FilterTags: FC<Props> = ({
  title,
  items,
  searchValue,
  limit = 5,
  selected = [],
  loading = false,
  error = false,
  searchInputPlaceholder = "Поиск...",
  onClickCheckbox,
  resetFilters,
  setSearchValue,
}) => {
  const [showAll, setShowAll] = useState(false);

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const visibleItems = showAll ? filteredItems : items.slice(0, limit);
  const showToggle = items.length > limit || items.length === 0;

  const onChangeShowAll = () => {
    setShowAll((prev) => !prev);
    setSearchValue("");
  };

  const onChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

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
        <CheckboxFilterGroup
          items={visibleItems}
          limit={limit}
          selected={selected}
          showAll={showAll}
          showToggle={showToggle}
          loading={loading}
          onClickCheckbox={onClickCheckbox}
          onChangeShowAll={onChangeShowAll}
        />
      )}
    </div>
  );
};
