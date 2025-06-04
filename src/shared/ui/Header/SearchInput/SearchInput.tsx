"use client";

import {
  Autocomplete,
  AutocompleteRenderGroupParams,
  AutocompleteRenderInputParams,
  CircularProgress,
  TextField,
} from "@mui/material";
import { Category, Product } from "@prisma/client";
import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import {
  HTMLAttributes,
  Key,
  useEffect,
  useRef,
  useState,
  type FC,
} from "react";

import { useLazySearchProductsQuery } from "@/shared/api/client/productsQuery";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useOutsideClick } from "@/shared/hooks/useOutsideHook";

import s from "./SearchInput.module.scss";

const DEBOUNCE_DELAY = 300;
const DEFAULT_CATEGORY_NAME = "Без категории";

interface Props {
  categories: Omit<Category, "createdAt" | "updatedAt">[];
  className?: string;
}

interface AutocompleteOptionProps extends HTMLAttributes<HTMLLIElement> {
  key: Key;
}

export const SearchInput: FC<Props> = ({ categories, className }) => {
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

  // Render input
  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      inputRef={inputRef}
      variant="filled"
      label="Поиск"
      className={s.textField}
      slotProps={{
        input: {
          ...params.InputProps,
          endAdornment: (
            <>
              {isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : null}
              {params.InputProps.endAdornment}
            </>
          ),
        },
      }}
    />
  );

  // Render list
  const renderList = (params: AutocompleteRenderGroupParams) => (
    <li key={params.key}>
      <div className={s.groupHeader}>{params.group}</div>
      <ul className={s.groupItems}>{params.children}</ul>
    </li>
  );

  // Render items in list
  const renderOption = (props: AutocompleteOptionProps, option: Product) => {
    const { key, ...otherProps } = props;
    return (
      <li key={key} {...otherProps} className={s.optionLi}>
        <Link href={`/${option.categorySlug}/${option.id}`} className={s.link}>
          <Image
            className={s.img}
            width={39}
            height={39}
            src={option.imageUrl}
            alt={option.name}
            loading="lazy"
          />
          <span>{option.name}</span>
        </Link>
      </li>
    );
  };

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
          renderInput={renderInput}
          renderGroup={renderList}
          renderOption={renderOption}
          inputMode="search"
        />
      </div>
    </>
  );
};
