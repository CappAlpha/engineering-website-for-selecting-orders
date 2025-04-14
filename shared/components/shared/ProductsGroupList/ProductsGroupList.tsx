"use client";
import { useIntersectionObserver } from "@/hook/useIntersectionObserver.ts";
import { useEffect, useRef, type FC } from "react";
import { useActions } from "@/hook/useActions.ts";
import s from "./ProductsGroupList.module.scss";
import { ProductCard } from "../ProductCard";

export interface Props {
  id: number;
  name: string;
  items: any[];
}

export const ProductsGroupList: FC<Props> = ({ id, name, items }) => {
  const { setActiveId } = useActions();
  const intersectionRef = useRef(null);
  const intersection = useIntersectionObserver(intersectionRef, {
    threshold: 0.6,
  });

  useEffect(() => {
    if (intersection?.isIntersecting) {
      setActiveId(id);
    }
  }, [intersection?.isIntersecting]);

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
          />
        ))}
      </div>
    </div>
  );
};
