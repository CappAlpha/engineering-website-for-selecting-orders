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
import { HTMLAttributes, Key, useRef, useState, type FC } from "react";

import { useDebounce } from "@/shared/hooks/useDebounce";
import { useOutsideClick } from "@/shared/hooks/useOutsideHook";
import { getSearchProducts } from "@/shared/lib/getSearchProducts";

import s from "./SearchInput.module.scss";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const ref = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // TODO: remove or made limit
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const onClose = () => {
    setOpen(false);
    setSearchQuery("");
    inputRef.current?.blur();
  };

  // Close component when click outside
  useOutsideClick({
    elementRef: ref,
    handler: () => {
      onClose();
    },
    attached: open,
  });

  const onOpen = () => {
    setOpen(true);
    getSearchProducts(setLoading, setError, setProducts, debouncedSearchQuery);
  };

  // Get category name by slug
  const getCategoryNameById = (categorySlug: string) =>
    categories.find((category) => category.slug === categorySlug)?.name ??
    "Без категории";

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
              {loading ? <CircularProgress color="inherit" size={20} /> : null}
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
          />
          {option.name}
        </Link>
      </li>
    );
  };

  return (
    <>
      <div className={cn(s.bg, !open && s.hidden)} />
      <div ref={ref} className={cn(s.root, className)}>
        {error ? (
          <p className={s.error}>Ошибка загрузки списка продуктов</p>
        ) : (
          <Autocomplete
            open={open}
            onOpen={onOpen}
            onClose={onClose}
            options={products}
            groupBy={(option) => getCategoryNameById(option.categorySlug)}
            getOptionLabel={(option) => option.name}
            inputValue={searchQuery}
            onInputChange={(e, value) => setSearchQuery(value)}
            loading={loading}
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
        )}
      </div>
    </>
  );
};
