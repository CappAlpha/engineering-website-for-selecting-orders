"use client";

import { type FC } from "react";

import { ProductCardLine } from "@/components/shared/ProductCardLine";
import { Button } from "@/components/ui/Button";
import { CartState } from "@/store/cart/cartSlice";
import { pluralize } from "@/utils/pluralize";

import { Arrow, Plus } from "../../../../../../public/icon";
import { Props } from "../CartDrawer";

import s from "./ListCartDrawer.module.scss";

export const ListCartDrawer: FC<Pick<Props, "toggleDrawer"> & CartState> = ({
  toggleDrawer,
  totalAmount,
  items,
}) => {
  const getPluralizeGoods = pluralize("товар", "товара", "товаров");
  const productsLength = items.length;
  const renderTopInfo = (
    <b>
      {productsLength} {getPluralizeGoods(productsLength)}
    </b>
  );

  return (
    <>
      <div className={s.top}>
        <p className={s.topInfo}>В корзине {renderTopInfo}</p>
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
        {items.map((item) => (
          <ProductCardLine key={item.name} item={item} />
        ))}
      </div>

      <div className={s.bottom}>
        <div className={s.bottomWrap}>
          <div className={s.bottomTextWrap}>
            <p className={s.bottomTitle}>Итого</p>
            <div className={s.line} />
            <p className={s.bottomPrice}>{totalAmount}</p>
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
