"use client";

import { Product } from "@prisma/client";
import { useCallback, type FC } from "react";
import { useDispatch } from "react-redux";

import { useAppSelector } from "@/hook/useAppSelector";
import { useIntersectionObserver } from "@/hook/useIntersectionObserver.ts";
import { categoriesActions } from "@/store/categories/categoriesSlice";
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
  const isLoading = useAppSelector((state) => state.cart.loadingFetch);

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
      {isLoading ? (
        <div className={s.titleSkeleton} />
      ) : (
        <h2 className={s.title}>{name}</h2>
      )}

      <div className={s.list}>
        {isLoading
          ? Array.from({ length: items.length }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          : items.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
      </div>
    </section>
  );
};
