"use client";

import { Product } from "@prisma/client";
import { useCallback, useEffect, type FC } from "react";
import { useDispatch } from "react-redux";

import { categoriesActions } from "@/modules/Catalog/store/categoriesSlice";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import { AppDispatch } from "@/store/store";

import { filtersActions } from "../../store/filtersSlice";
import { ProductCard } from "../ProductCard";
import { ProductCardsSkeleton } from "../ProductCard/ProductCardsSkeleton";

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

  const changed = useAppSelector((state) => state.filters.changed);

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

  useEffect(() => {
    dispatch(filtersActions.resetChanged());
  }, [dispatch]);

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
        {changed ? (
          <ProductCardsSkeleton count={items.length} />
        ) : (
          items.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              isFirstCategories={isFirstCategories}
            />
          ))
        )}
      </div>
    </section>
  );
};
