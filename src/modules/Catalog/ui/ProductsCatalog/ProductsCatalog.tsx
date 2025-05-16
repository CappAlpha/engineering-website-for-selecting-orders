import { Category, Product } from "@prisma/client";
import { type FC } from "react";

import { ProductsGroupList } from "../ProductsGroupList";
import { ProductNotFound } from "./ProductNotFound";

import s from "./ProductsCatalog.module.scss";

interface CategoryProps extends Category {
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
            isLazy={index > 1}
          />
        ))
      ) : (
        <ProductNotFound />
      )}
    </div>
  );
};
