"use client";
import { useEffect, useRef, type FC } from 'react';

import { ProductCard } from '../ProductCard';

import s from './ProductsGroupList.module.scss';
import { useIntersectionObserver } from '@/hook/useIntersectionObserver.ts';
import { useActions } from '@/hook/useActions.ts';

export interface Props {
  title: string;
  items: any[];
  categoryId: number;
}

export const ProductsGroupList: FC<Props> = ({ title, items, categoryId }) => {
  const { setActiveId } = useActions();
  const intersectionRef = useRef(null);
  const intersection = useIntersectionObserver(intersectionRef, { threshold: 0.4 });

  useEffect(() => {
    if (intersection?.isIntersecting) {
      setActiveId(categoryId);
    }
  }, [intersection?.isIntersecting])

  return (
    <div className={s.root} id={title} ref={intersectionRef}>
      <h2 className={s.title}>{title}</h2>

      <div className={s.list}>
        {items.map((product) =>
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            imageUrl={product.imageUrl}
            price={product.price}
          />
        )}
      </div>
    </div>
  );
};