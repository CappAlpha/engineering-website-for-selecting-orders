"use client";

import { Autocomplete } from "@mui/material";
import cn from "classnames";
import { useEffect, useMemo, useRef, useState, type FC } from "react";

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

export const Search: FC<Props> = ({
  categories,
  isAdmin = false,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  const isAutocompleteOpen = isAdmin || open;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);
  const [triggerSearch, { data: products = [], isLoading, error }] =
    useLazySearchProductsQuery();

  const categoryNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const category of categories) {
      map.set(category.slug, category.name);
    }
    return map;
  }, [categories]);

  const getCategoryNameBySlug = (slug: string) =>
    categoryNameMap.get(slug) ?? DEFAULT_CATEGORY_NAME;

  const categoryIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    categories.forEach((category, index) => {
      map.set(category.slug, index);
    });
    return map;
  }, [categories]);

  const getCategoryIndex = (slug: string): number =>
    categoryIndexMap.get(slug) ?? categories.length;

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const indexA = getCategoryIndex(a.categorySlug);
      const indexB = getCategoryIndex(b.categorySlug);
      return indexA - indexB;
    });
  }, [products, categoryNameMap, getCategoryIndex, categories.length]);

  const onClose = () => {
    setOpen(false);
    inputRef.current?.blur();
  };

  const onOpen = () => {
    setOpen(true);
  };

  // Performing a search when the debounced query changes
  useEffect(() => {
    if (isAutocompleteOpen && debouncedSearchQuery.trim()) {
      void triggerSearch(debouncedSearchQuery);
    }
  }, [triggerSearch, debouncedSearchQuery, open, isAdmin]);

  // Close component when click outside
  // useOutsideClick({
  //   elementRef: containerRef,
  //   handler: onClose,
  //   attached: open,
  // });

  // Render  error
  if (error) {
    return (
      <div className={cn(s.root, className)}>
        <p className={s.error}>Ошибка загрузки списка продуктов</p>
      </div>
    );
  }

  return (
    <>
      {!isAdmin && <div className={cn(s.bg, !open && s.hidden)} />}
      <div ref={containerRef} className={cn(s.root, className)}>
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
          clearOnEscape={true}
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
