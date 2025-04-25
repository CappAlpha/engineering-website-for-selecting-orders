"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useState, type FC } from "react";

import { Button } from "../Button";
import { Input } from "../Input";
import { FilterCheckbox } from "./FilterCheckbox";

import s from "./CheckboxFilterGroup.module.scss";

//TODO: refactor component
export interface Props {
  title: string;
  items: string[];
  limit: number;
  loading?: boolean;
  error?: boolean;
  searchInputPlaceholder?: string;
  onClickCheckbox?: (value: string) => void;
  selected?: Set<string>;
}

export const CheckboxFilterGroup: FC<Props> = ({
  title,
  items,
  limit = 5,
  loading = false,
  error = false,
  searchInputPlaceholder = "Поиск...",
  onClickCheckbox,
  selected,
}) => {
  const router = useRouter();
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
          <Button className={s.retry} onClick={() => router.refresh()}>
            Повторить
          </Button>
        </>
      ) : (
        <>
          <div className={s.items}>{renderLoadingList}</div>
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
