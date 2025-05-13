"use client";

import { type FC } from "react";

import { Button } from "@/shared/ui/Button";

import { FilterCheckbox } from "../FilterCheckbox";

import s from "./CheckboxFilterGroup.module.scss";

interface Props {
  items: string[];
  showAll: boolean;
  showToggle: boolean;
  limit: number;
  selected?: string[];
  loading?: boolean;
  onClickCheckbox?: (value: string) => void;
  onChangeShowAll?: () => void;
}

export const CheckboxFilterGroup: FC<Props> = ({
  items,
  showAll,
  showToggle,
  limit,
  selected = [],
  loading = false,
  onClickCheckbox,
  onChangeShowAll,
}) => {
  return (
    <>
      <ul className={s.items}>
        {loading && items.length === 0 ? (
          Array.from({ length: limit }).map((_, index) => (
            <li key={index} className={s.itemSkeleton}></li>
          ))
        ) : items.length > 0 ? (
          items.map((name) => (
            <li key={name}>
              <FilterCheckbox
                name={name}
                checked={selected?.includes(name) ?? false}
                onCheckedChange={() => onClickCheckbox?.(name)}
              />
            </li>
          ))
        ) : (
          <li className={s.noResults}>Ничего не найдено :(</li>
        )}
      </ul>
      {showToggle &&
        (loading ? (
          <div className={s.btnSkeleton} />
        ) : (
          <Button onClick={onChangeShowAll} color="transparent" noPadding>
            {showAll ? "Скрыть" : "+ Показать всё"}
          </Button>
        ))}
    </>
  );
};
