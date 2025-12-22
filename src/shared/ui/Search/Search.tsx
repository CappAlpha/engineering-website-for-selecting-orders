"use client";

import { Autocomplete } from "@mui/material";
import cn from "classnames";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useLazySearchProductsQuery } from "@/shared/api/client/productsQuery";
import type { CategoryBase } from "@/shared/entities/category";
import { useDebounce } from "@/shared/hooks/useDebounce";

import { SearchGroup } from "./SearchGroup";
import { SearchInput } from "./SearchInput";
import { SearchOption } from "./SearchOption";

import s from "./Search.module.scss";

const DEBOUNCE_DELAY = 300;
const DEFAULT_CATEGORY_NAME = "Без категории";

interface Props {
  categories: CategoryBase[];
  isAdmin?: boolean;
  className?: string;
}

export const Search = ({ categories, isAdmin = false, className }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  const isAutocompleteOpen = isAdmin || open;

  const debouncedSearchQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);

  const [triggerSearch, { data: products = [], isLoading, error }] =
    useLazySearchProductsQuery();

  const { categoryNameMap, categoryIndexMap } = useMemo(() => {
    const nameMap = new Map<string, string>();
    const indexMap = new Map<string, number>();

    categories.forEach((category, index) => {
      nameMap.set(category.slug, category.name);
      indexMap.set(category.slug, index);
    });

    return { categoryNameMap: nameMap, categoryIndexMap: indexMap };
  }, [categories]);

  const getCategoryNameBySlug = useCallback(
    (slug: string) => categoryNameMap.get(slug) ?? DEFAULT_CATEGORY_NAME,
    [categoryNameMap],
  );

  const sortedProducts = useMemo(() => {
    const fallbackIndex = categories.length;

    return [...products].sort((a, b) => {
      const indexA = categoryIndexMap.get(a.categorySlug) ?? fallbackIndex;
      const indexB = categoryIndexMap.get(b.categorySlug) ?? fallbackIndex;
      return indexA - indexB;
    });
  }, [products, categoryIndexMap, categories.length]);

  const onClose = () => {
    setOpen(false);
  };

  const onOpen = () => {
    setOpen(true);
  };

  // Performing a search when the debounced query changes
  useEffect(() => {
    const q = debouncedSearchQuery.trim();
    if (!isAutocompleteOpen || !q) return;

    void triggerSearch(q);
  }, [debouncedSearchQuery, isAutocompleteOpen, triggerSearch]);

  if (error) {
    return (
      <div className={cn(s.root, className)}>
        <p className={s.error}>Ошибка загрузки списка продуктов</p>
      </div>
    );
  }

  return (
    <>
      {/* TODO: fix overlay on input */}
      {!isAdmin && <div className={cn(s.bg, !open && s.hidden)} />}
      <div className={cn(s.root, className)}>
        <Autocomplete
          open={isAutocompleteOpen}
          onOpen={onOpen}
          onClose={onClose}
          options={sortedProducts}
          groupBy={(option) => getCategoryNameBySlug(option.categorySlug)}
          getOptionLabel={(option) => option.name}
          inputValue={searchQuery}
          onInputChange={(_e, value) => setSearchQuery(value)}
          loading={isLoading}
          loadingText="Загрузка..."
          noOptionsText="Ничего не найдено"
          clearOnEscape
          fullWidth
          autoHighlight
          selectOnFocus
          autoComplete
          disablePortal
          renderInput={SearchInput}
          renderGroup={SearchGroup}
          renderOption={(props, option) =>
            SearchOption({ ...props, isAdmin }, option)
          }
          inputMode="search"
        />
      </div>
    </>
  );
};
