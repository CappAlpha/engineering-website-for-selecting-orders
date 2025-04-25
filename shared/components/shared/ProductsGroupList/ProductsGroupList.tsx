"use client";

import { Product } from "@prisma/client";
import { useEffect, useRef, type FC } from "react";

import { useActions } from "@/hook/useActions.ts";
import { useIntersectionObserver } from "@/hook/useIntersectionObserver.ts";

import { ProductCard } from "../ProductCard";

import s from "./ProductsGroupList.module.scss";

export interface Props {
  id: number;
  name: string;
  items: Product[];
}

export const ProductsGroupList: FC<Props> = ({ id, name, items }) => {
  const { setActiveId } = useActions();
  const intersectionRef = useRef(null);
  const intersection = useIntersectionObserver(intersectionRef, {
    threshold: 0.4,
  });

  useEffect(() => {
    if (intersection?.isIntersecting) {
      setActiveId(id);
    }
  }, [intersection?.isIntersecting, id, setActiveId]);

  return (
    <div className={s.root} id={name} ref={intersectionRef}>
      <h2 className={s.title}>{name}</h2>

      <div className={s.list}>
        {items.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            imageUrl={product.imageUrl}
            price={product.price}
            tags={product.tags}
          />
        ))}
      </div>
    </div>
  );
};
