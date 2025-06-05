import { Category, Product } from "@prisma/client";
import { type FC } from "react";

import { ProductsGroupList } from "../ProductsGroupList";
import { ProductsNotFound } from "./ProductsNotFound";

import s from "./ProductsCatalog.module.scss";

export interface CategoryProps extends Category {
  products: Product[];
}

interface Props {
  categories: CategoryProps[];
}

export const ProductsCatalog: FC<Props> = ({ categories }) => {
  return (
    <div className={s.root}>
      {categories.length !== 0 ? (
        categories.map(({ name, products }, index) => (
          <ProductsGroupList
            key={name}
            name={name}
            items={products}
            isFirstCategories={index < 2}
          />
        ))
      ) : (
        <ProductsNotFound />
      )}
    </div>
  );
};
