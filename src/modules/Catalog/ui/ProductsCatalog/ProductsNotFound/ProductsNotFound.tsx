"use client";

import { type FC } from "react";

import { useResetFilters } from "@/modules/Catalog/hooks/useResetFilters";
import { Button } from "@/shared/ui/Button";

import s from "./ProductsNotFound.module.scss";

export const ProductsNotFound: FC = () => {
  const { resetFilters } = useResetFilters();

  return (
    <div className={s.root}>
      <h5 className={s.notFound}>Товары не найдены :(</h5>
      <p className={s.description}>
        Попробуйте поменять фильтры или обновите страницу
      </p>
      <Button className={s.refresh} onClick={resetFilters}>
        Сбросить фильтры
      </Button>
    </div>
  );
};
