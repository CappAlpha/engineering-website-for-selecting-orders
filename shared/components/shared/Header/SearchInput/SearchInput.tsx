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
import Link from "next/link";
import {
  HTMLAttributes,
  Key,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
} from "react";

import { pageConfig } from "@/constants/pages";
import { useDebounce } from "@/hook/useDebounce";
import { useOutsideClick } from "@/hook/useOutsideHook";
import { Api } from "@/services/apiClient";
import { getCachedData } from "@/utils/getCacheData";

import s from "./SearchInput.module.scss";

interface Props {
  categories: Category[];
}

interface AutocompleteOptionProps extends HTMLAttributes<HTMLLIElement> {
  key: Key;
}

const CACHE_KEY = "searchHeaderData";
const CACHE_DURATION = 4 * 60 * 60 * 1000;

export const SearchInput: FC<Props> = ({ categories }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Close component when click outside
  useOutsideClick({
    elementRef: ref,
    handler: () => {
      setOpen(false);
    },
    attached: open,
  });

  // Close on key Escape
  const closeBg = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open === true) {
        setOpen(false);
      }
    },
    [open],
  );

  useEffect(() => {
    document.addEventListener("keydown", closeBg);
    return () => {
      document.removeEventListener("keydown", closeBg);
    };
  }, [closeBg]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(false);

    const cached = getCachedData<Product>(CACHE_KEY, CACHE_DURATION);
    if (cached) {
      setProducts(cached);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    try {
      const response = await Api.products.search(
        debouncedSearchQuery,
        controller.signal,
      );
      setProducts(response);

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ items: response, timestamp: Date.now() }),
      );
    } catch (err) {
      if (
        err instanceof Error &&
        (err.name === "CanceledError" || err.message.includes("canceled"))
      ) {
        return;
      }
      console.error("Ошибка при поиске продуктов:", err);
      setProducts([]);
      setError(true);
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open, fetchProducts]);

  // Get category name by id
  const getCategoryNameById = (categoryId: number): string =>
    categories.find((category) => category.id === categoryId)?.name ??
    "Без категории";

  // Render input
  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      variant="filled"
      label="Поиск"
      className={s.textField}
      InputProps={{
        ...params.InputProps,
        endAdornment: (
          <>
            {loading ? <CircularProgress color="inherit" size={20} /> : null}
            {params.InputProps.endAdornment}
          </>
        ),
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
        <Link href={`${pageConfig.PRODUCT}${option.id}`} className={s.link}>
          {option.name}
        </Link>
      </li>
    );
  };

  return (
    <>
      <div className={cn(s.bg, !open && s.hidden)} />
      <div ref={ref} className={s.root}>
        {error ? (
          <p>Ошибка загрузки списка продуктов</p>
        ) : (
          <Autocomplete
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            options={products}
            groupBy={(option) => getCategoryNameById(option.categoryId)}
            getOptionLabel={(option) => option.name}
            inputValue={searchQuery}
            onInputChange={(e, value) => setSearchQuery(value)}
            loading={loading}
            loadingText="Загрузка..."
            noOptionsText="Ничего не найдено"
            fullWidth
            disablePortal
            renderInput={renderInput}
            renderGroup={renderList}
            renderOption={renderOption}
          />
        )}
      </div>
    </>
  );
};
