"use client";

import { Product } from "@prisma/client";
import { type FC } from "react";

import { useCart } from "@/modules/Cart/actions/useCart";
import { Button } from "@/shared/ui/Button";
import { Tags } from "@/shared/ui/Tags";

import s from "./ProductProperties.module.scss";

type Props = Omit<
  Product,
  "imageUrl" | "categoryId" | "createdAt" | "updatedAt"
>;

export const ProductProperties: FC<Props> = ({
  id,
  name,
  description,
  price,
  tags,
}) => {
  const { errorFetch, loadingAdd, errorAdd, addToCart } = useCart();

  const isError = errorFetch ?? errorAdd;

  return (
    <div className={s.root}>
      <ul className={s.properties}>
        <li>
          <h2 className={s.title}>{name}</h2>
        </li>
        <li>
          <p className={s.description}>{description}</p>
        </li>
        <li>Цена - {price} &#8381;</li>
        <li>
          <Tags tags={tags} />
        </li>
      </ul>
      {!isError && (
        <Button
          className={s.btn}
          onClick={(e) => addToCart(e, id)}
          loading={loadingAdd}
        >
          Добавить в корзину
        </Button>
      )}
    </div>
  );
};
