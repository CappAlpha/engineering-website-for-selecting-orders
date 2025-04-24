import { Category, Product } from "@prisma/client";
import { type FC } from "react";

import { ProductsGroupList } from "../ProductsGroupList";

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
      {categories.map(({ id, name, products }) => (
        <ProductsGroupList key={id} id={id} name={name} items={products} />
      ))}
    </div>
  );
};
