"use client";

import { Product } from "@prisma/client";
import { type MouseEvent, useCallback, type FC } from "react";
import { useDispatch } from "react-redux";

import { useCartReducers } from "@/modules/Cart/services/useCartReducers";
import { categoriesActions } from "@/modules/Catalog/store/categoriesSlice";
import { useIntersectionObserver } from "@/shared/hook/useIntersectionObserver";
import { AppDispatch } from "@/store/store";

import { ProductCard } from "../ProductCard";

import s from "./ProductsGroupList.module.scss";

interface Props {
  name: string;
  items: Product[];
  isFirstCategories: boolean;
}

export const ProductsGroupList: FC<Props> = ({
  name,
  items,
  isFirstCategories,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { addToCart } = useCartReducers();

  const handleIntersection = useCallback(
    (isIntersecting: boolean) => {
      if (isIntersecting) {
        dispatch(categoriesActions.setActiveId(name));
      }
    },
    [dispatch, name],
  );

  const { ref } = useIntersectionObserver({
    threshold: 0.4,
    callback: handleIntersection,
  });

  return (
    <section
      key={name}
      id={name}
      ref={ref}
      className={s.root}
      aria-label={`Группа продуктов: ${name}`}
    >
      <h2 className={s.title}>{name}</h2>

      <div className={s.list}>
        {items.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onClickButton={(e: MouseEvent) => addToCart(e, product.id)}
            isFirstCategories={isFirstCategories}
          />
        ))}
      </div>
    </section>
  );
};
