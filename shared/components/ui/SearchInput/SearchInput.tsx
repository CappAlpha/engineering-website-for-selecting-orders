"use client";
import { HTMLAttributes, Key, useCallback, useEffect, useMemo, useRef, useState, type FC } from "react";

import {
  Autocomplete,
  AutocompleteRenderGroupParams,
  AutocompleteRenderInputParams,
  CircularProgress,
  styled,
  TextField,
} from "@mui/material";
import { useOutsideClick } from "@/hook/useOutsideHook";
import { Api } from "../../../../services/api-client";
import { Category, Product } from "@prisma/client";
import s from "./SearchInput.module.scss";
import cn from "classnames";
import { useDebounce } from "@/hook/useDebounce";
import Link from "next/link"; // Для создания ссылок в Next.js

export interface Props {
  //
}

interface AutocompleteOptionProps extends HTMLAttributes<HTMLLIElement> {
  key: Key;
}

const CATEGORIES: Pick<Category, "id" | "name">[] = [
  {
    id: 1,
    name: "Чертежи",
  },
  {
    id: 2,
    name: "БЭМ",
  },
  {
    id: 3,
    name: "Геология",
  },
  {
    id: 4,
    name: "Программы на C++",
  },
];

const CssTextField = styled(TextField)({
  "& .MuiFormLabel-root": {
    color: "#fff",
  },
  "& .MuiInputBase-root": {
    color: "#fff",
    borderBottom: "1px solid #fff",
    paddingTop: "14px",
  },
  "& .MuiInputBase-input": {
    padding: "",
  },
  "& .MuiIconButton-root": {
    color: "#fff",
  }
});

export const SearchInput: FC<Props> = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useOutsideClick({
    elementRef: ref,
    handler: () => {
      setOpen(false);
    },
    attached: open
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
        const items = await Api.products.search(debouncedSearchQuery);
        setProducts(items);
      } catch (error) {
        console.error("Ошибка при поиске продуктов:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearchQuery]);

  const getCategoryNameById = (categoryId: number): string => {
    const category = CATEGORIES.find((cat) => cat.id === categoryId);
    return category ? category.name : "Без категории";
  };

  const filteredAndSortedProducts = useMemo(
    () =>
      products
        .filter((product) =>
          CATEGORIES.some((category) => category.id === product.categoryId),
        )
        .sort((a, b) => a.categoryId - b.categoryId),
    [products],
  );

  // Рендеринг поля ввода
  const renderInput = (params: AutocompleteRenderInputParams) => (
    <CssTextField {...params} variant="filled" label="Поиск" className={s.textField} slotProps={{
      input: {
        ...params.InputProps,
        endAdornment: (
          <>
            {loading ? <CircularProgress color="inherit" size={20} /> : null}
            {params.InputProps.endAdornment}
          </>
        ),
      },
    }} />
  );

  // Рендеринг группы
  const renderList = (params: AutocompleteRenderGroupParams) => (
    <li key={params.key}>
      <div className={s.groupHeader}>{params.group}</div>
      <ul className={s.groupItems}>{params.children}</ul>
    </li>
  );

  // Рендеринг каждого элемента списка
  const renderOption = (
    props: AutocompleteOptionProps,
    option: Product,
  ) => {
    const { key, ...otherProps } = props;
    return (
      <li key={key} {...otherProps}>
        {/* TODO: fix link */}
        <Link href={`/product/${option.id}`} passHref style={{ width: "100%" }}>
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
          options={filteredAndSortedProducts}
          groupBy={(option) => getCategoryNameById(option.categoryId)}
          getOptionLabel={(option) => option.name}
          inputValue={searchQuery}
          onInputChange={(e, value) => setSearchQuery(value)}
          onChange={(e, value) => setSelectedProduct(value)}
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
