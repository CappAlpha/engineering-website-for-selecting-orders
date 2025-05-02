"use client";

import { Product } from "@prisma/client";
import { MouseEvent, useCallback, type FC } from "react";
import { useDispatch } from "react-redux";

import { useCart } from "@/modules/Cart/actions/useCart";
import { categoriesActions } from "@/modules/Catalog/store/categoriesSlice";
import { useIntersectionObserver } from "@/shared/hook/useIntersectionObserver";
import { AppDispatch } from "@/store/store";

import { ProductCard } from "../ProductCard";
import { ProductCardSkeleton } from "../ProductCard/ProductCardSkeleton";

import s from "./ProductsGroupList.module.scss";

interface Props {
  name: string;
  items: Product[];
}

export const ProductsGroupList: FC<Props> = ({ name, items }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loadingAddProductId, errorFetch, errorAdd, addToCart } = useCart();
  const isErrorCard = errorFetch ?? errorAdd;

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

  // TODO: add loading?
  const loadingFetchCategories = false;

  return (
    <section
      key={name}
      id={name}
      ref={ref}
      className={s.root}
      aria-label={`Группа продуктов: ${name}`}
    >
      {loadingFetchCategories ? (
        <div className={s.titleSkeleton} />
      ) : (
        <h2 className={s.title}>{name}</h2>
      )}

      <div className={s.list}>
        {loadingFetchCategories
          ? Array.from({ length: items.length }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          : items.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                isError={isErrorCard}
                loadingAdd={loadingAddProductId === product.id}
                onClickButton={(e: MouseEvent) => addToCart(e, product.id)}
              />
            ))}
      </div>
    </section>
  );
};
