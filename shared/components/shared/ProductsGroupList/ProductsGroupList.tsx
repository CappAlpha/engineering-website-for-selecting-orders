"use client";

import { Product } from "@prisma/client";
import { useEffect, useRef, type FC } from "react";
import { useDispatch } from "react-redux";

import { useAppSelector } from "@/hook/useAppSelector";
import { useIntersectionObserver } from "@/hook/useIntersectionObserver.ts";
import { categoriesActions } from "@/store/categories/categoriesSlice";

import { ProductCard } from "../ProductCard";
import { ProductCardSkeleton } from "../ProductCard/ProductCardSkeleton";

import s from "./ProductsGroupList.module.scss";

export interface Props {
  id: number;
  name: string;
  items: Product[];
}

export const ProductsGroupList: FC<Props> = ({ id, name, items }) => {
  const dispatch = useDispatch();
  const isLoading = useAppSelector((state) => state.cart.loadingFetch);

  const intersectionRef = useRef<HTMLDivElement | null>(null);
  const intersection = useIntersectionObserver(intersectionRef, {
    threshold: 0.5,
  });

  useEffect(() => {
    if (intersection?.isIntersecting) {
      dispatch(categoriesActions.setActiveId(id));
    }
  }, [intersection?.isIntersecting, id, dispatch]);

  return (
    <section
      id={name}
      ref={intersectionRef}
      className={s.root}
      aria-label={`Группа продуктов: ${name}`}
    >
      <h2 className={s.title}>{name}</h2>

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
