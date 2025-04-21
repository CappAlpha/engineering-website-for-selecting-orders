"use client";

import { Product } from "@prisma/client";
import { type FC } from "react";

import { ProductCardLine } from "@/components/shared/ProductCardLine";
import { Button } from "@/components/ui/Button";

import { Arrow, Plus } from "../../../../../../public/icon";
import { Props } from "../CartDrawer";

import s from "./ListCartDrawer.module.scss";

const CARDS: Pick<Product, "name" | "description" | "imageUrl" | "price">[] = [
  {
    name: "Чертёж моста",
    description: "В кратчайшие сроки бла бла бла",
    imageUrl: "/images/catalog/drawings/1.webp",
    price: 9544,
  },
  {
    name: "Чертёж здания",
    description: "В кратчайшие сроки бла бла бла по ГОСТУ",
    imageUrl: "/images/catalog/drawings/1.webp",
    price: 4544,
  },
];

export const ListCartDrawer: FC<Pick<Props, "toggleDrawer">> = ({
  toggleDrawer,
}) => {
  return (
    <>
      <div className={s.top}>
        <p className={s.topInfo}>
          В корзине <b>3 товара</b>
        </p>
        <Button
          color="transparent"
          onClick={toggleDrawer(false)}
          noPadding
          className={s.close}
        >
          <Plus className={s.icon} />
        </Button>
      </div>

      <div className={s.cards}>
        {CARDS.map((card) => (
          <ProductCardLine key={card.name} card={card} />
        ))}
      </div>

      <div className={s.bottom}>
        <div className={s.bottomWrap}>
          <div className={s.bottomTextWrap}>
            <p className={s.bottomTitle}>Итого</p>
            <div className={s.line} />
            <p className={s.bottomPrice}>2245 &#8381;</p>
          </div>
          <div className={s.bottomTextWrap}>
            <p className={s.bottomTitle}>Налог 5%</p>
            <div className={s.line} />
            <p className={s.bottomPrice}>112 &#8381;</p>
          </div>
          <Button onClick={toggleDrawer(false)} className={s.orderBtn} size="l">
            Оформить заказ
            <Arrow className={s.orderIcon} />
          </Button>
        </div>
      </div>
    </>
  );
};
