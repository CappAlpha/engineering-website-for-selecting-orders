"use client";

import { Autocomplete } from "@mui/material";
import cn from "classnames";
import { useEffect, useRef, useState, type FC } from "react";

import { useLazySearchProductsQuery } from "@/shared/api/client/productsQuery";
import { CategoryBase } from "@/shared/entities/category";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useOutsideClick } from "@/shared/hooks/useOutsideHook";

import { SearchGroup } from "./SearchGroup";
import { SearchInput } from "./SearchInput";
import { SearchOption } from "./SearchOption";

import s from "./Search.module.scss";

const DEBOUNCE_DELAY = 300;
const DEFAULT_CATEGORY_NAME = "Без категории";

interface Props {
  categories: CategoryBase[];
  className?: string;
}

export const Search: FC<Props> = ({ categories, className }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);
  const [triggerSearch, { data: products = [], isLoading, error }] =
    useLazySearchProductsQuery();

  // Get category name by slug
  const getCategoryNameBySlug = (categorySlug: string) =>
    categories.find((category) => categorySlug === category.slug)?.name ??
    DEFAULT_CATEGORY_NAME;

  const categoryIndexMap = new Map(
    categories.map((category, index) => [category.slug, index]),
  );

  const getCategoryIndex = (categorySlug: string) =>
    categoryIndexMap.get(categorySlug) ?? categories.length;

  const sortedProducts = [...products].sort((a, b) => {
    const indexA = getCategoryIndex(a.categorySlug);
    const indexB = getCategoryIndex(b.categorySlug);
    return indexA - indexB;
  });

  const onClose = () => {
    setOpen(false);
    setSearchQuery("");
    inputRef.current?.blur();
  };

  const onOpen = () => {
    setOpen(true);
  };

  // Performing a search when the debounced query changes
  useEffect(() => {
    if (open) {
      triggerSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, open]);

  // Close component when click outside
  useOutsideClick({
    elementRef: containerRef,
    handler: onClose,
    attached: open,
  });

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
      <div className={cn(s.bg, !open && s.hidden)} />
      <div ref={containerRef} className={cn(s.root, className)}>
        <Autocomplete
          open={open}
          onOpen={onOpen}
          onClose={onClose}
          options={sortedProducts}
          groupBy={(option) => getCategoryNameBySlug(option.categorySlug)}
          getOptionLabel={(option) => option.name}
          inputValue={searchQuery}
          onInputChange={(e, value) => setSearchQuery(value)}
          loading={isLoading}
          loadingText="Загрузка..."
          noOptionsText="Ничего не найдено"
          clearOnEscape={true}
          fullWidth
          disablePortal
          renderInput={SearchInput}
          renderGroup={SearchGroup}
          renderOption={SearchOption}
          inputMode="search"
        />
      </div>
    </>
  );
};
