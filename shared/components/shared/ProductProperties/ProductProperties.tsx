"use client";
import { type FC } from 'react';
import { Product } from '@prisma/client';

import s from './ProductProperties.module.scss';
import { Button } from '@/components/ui/Button';
import { Tags } from '../Tags';

export interface Props extends Pick<Product, 'name' | 'description' | 'price'> {
  name: string;
  description: string;
  price: number;
  tags: string[];
}

export const ProductProperties: FC<Props> = ({ name,
  description,
  price, tags }) => {

  const handleClick = () => {
    console.log({ name, price })
  };

  return (
    <div className={s.root}>
      <ul className={s.properties}>
        <li>
          <h2 className={s.title}>{name}</h2>
        </li>
        <li><p className={s.description}>{description}</p></li>
        <li>Цена - {price}</li>
        <li><Tags tags={tags} /></li>
      </ul>
      <Button className={s.btn} onClick={handleClick}>
        Добавить в корзину за {price}
      </Button>
    </div>
  );
};