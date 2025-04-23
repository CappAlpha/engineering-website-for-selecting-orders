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
import { Api } from "@/services/api-client";

import s from "./SearchInput.module.scss";

interface Props {
  categories: Category[];
}

interface AutocompleteOptionProps extends HTMLAttributes<HTMLLIElement> {
  key: Key;
}

export const SearchInput: FC<Props> = ({ categories }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useOutsideClick({
    elementRef: ref,
    handler: () => {
      setOpen(false);
    },
    attached: open,
  });

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await Api.products.search(debouncedSearchQuery);
        setProducts(response);
      } catch (error) {
        console.error("Ошибка при поиске продуктов:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (open && products.length === 0) {
      fetchProducts();
    }
  }, [debouncedSearchQuery, open, products.length]);

  const getCategoryNameById = (categoryId: number): string => {
    const categoryName = categories.find(
      (category) => category.id === categoryId,
    )?.name;
    return categoryName ?? "Без категории";
  };

  // Рендеринг поля ввода
  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
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

  // Рендеринг группы
  const renderList = (params: AutocompleteRenderGroupParams) => (
    <li key={params.key}>
      <div className={s.groupHeader}>{params.group}</div>
      <ul className={s.groupItems}>{params.children}</ul>
    </li>
  );

  // Рендеринг каждого элемента списка
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
          renderInput={(params) => renderInput(params)}
          renderGroup={(params) => renderList(params)}
          renderOption={(props, option) => renderOption(props, option)}
        />
      </div>
    </>
  );
};
