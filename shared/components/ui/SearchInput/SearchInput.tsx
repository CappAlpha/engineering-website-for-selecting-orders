"use client";
import { useCallback, useEffect, useRef, useState, type FC } from "react";

import {
  Autocomplete,
  AutocompleteRenderGroupParams,
  AutocompleteRenderInputParams,
  darken,
  lighten,
  styled,
  TextField,
} from "@mui/material";
import { useOutsideClick } from "@/hook/useOutsideHook";
import { Api } from "../../../../services/api-client";
import { Category, Product } from "@prisma/client";
import s from "./SearchInput.module.scss";
import cn from "classnames";

export interface Props {
  //
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
});

const GroupHeader = styled("div")(({ theme }) => ({
  position: "sticky",
  top: "-8px",
  padding: "4px 10px",
  color: theme.palette.primary.main,
  backgroundColor: lighten(theme.palette.primary.light, 0.85),
  ...theme.applyStyles("dark", {
    backgroundColor: darken(theme.palette.primary.main, 0.8),
  }),
}));

const GroupItems = styled("ul")({
  padding: 0,
});

export const SearchInput: FC<Props> = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick({
    elementRef: ref,
    handler: () => {
      setFocused(false);
    },
  });

  const closeBg = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && focused === true) {
        (document.activeElement as HTMLElement)?.blur();
        setFocused(false);
      }
    },
    [focused],
  );

  useEffect(() => {
    document.addEventListener("keydown", closeBg);
    return () => {
      document.removeEventListener("keydown", closeBg);
    };
  }, [closeBg]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setProducts([]);
      setLoading(true);
      return;
    }
    Api.products.search(searchQuery).then((items) => {
      setLoading(false);
      setProducts(items);
    });
  }, [searchQuery]);

  const getCategoryNameById = (categoryId: number): string => {
    const category = CATEGORIES.find((cat) => cat.id === categoryId);
    return category ? category.name : "Без категории";
  };

  const filteredAndSortedProducts = products
    .filter((product) =>
      CATEGORIES.some((category) => category.id === product.categoryId),
    )
    .sort((a, b) => a.categoryId - b.categoryId);

  const isProductsExist = products.length < 0;

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <CssTextField {...params} variant="filled" label="Поиск" type="search" />
  );

  const renderList = (params: AutocompleteRenderGroupParams) => (
    <li key={params.key}>
      <GroupHeader>{params.group}</GroupHeader>
      <GroupItems>{params.children}</GroupItems>
    </li>
  );

  return (
    <>
      <div className={cn(s.bg, !focused && s.hidden)} />
      <div ref={ref} className={s.root}>
        <Autocomplete
          options={filteredAndSortedProducts}
          groupBy={(option) => getCategoryNameById(option.categoryId)}
          getOptionLabel={(option) => option.name}
          onFocus={() => setFocused(true)}
          inputValue={searchQuery}
          onInputChange={(e, value) => setSearchQuery(value)}
          loading={loading}
          loadingText="Загрузка..."
          noOptionsText="Ничего не найдено"
          fullWidth
          renderInput={(params) => renderInput(params)}
          renderGroup={(params) => renderList(params)}
        />
      </div>
    </>
  );
};
