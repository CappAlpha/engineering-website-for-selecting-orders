"use client";

import cn from "classnames";
import { type FC } from "react";

import { PageConfig } from "@/shared/constants/pages";
import { Button } from "@/shared/ui/Button";
import { pluralize } from "@/shared/utils/pluralize";

import { Arrow, Plus } from "../../../../../public/icon";
import { useCartQueries } from "../../hooks/useCartQueries";
import { ProductCardLine } from "../ProductCardLine";

import s from "./ListCartDrawer.module.scss";

interface ListCardDrawerProps {
  onClose?: VoidFunction;
}

export const ListCartDrawer: FC<ListCardDrawerProps> = ({ onClose }) => {
  const {
    totalAmount,
    cartItems,
    isCartLoading,
    cartError,
    refetchCart,
    cartUpdateError,
    isCartQuery,
  } = useCartQueries();

  const getPluralizeGoods = pluralize("товар", "товара", "товаров");
  const productsInCartCount = cartItems.length ?? 0;
  const hasError = cartUpdateError || cartError;

  return (
    <>
      <div className={s.top}>
        <p className={s.topInfo}>
          В корзине{" "}
          <b>
            {productsInCartCount} {getPluralizeGoods(productsInCartCount)}
          </b>
        </p>
        <Button
          color="transparent"
          onClick={onClose}
          noPadding
          className={s.close}
        >
          <Plus className={s.icon} />
        </Button>
      </div>

      <div className={s.cards}>
        {cartItems.map((item) => (
          <ProductCardLine key={item.name} item={item} />
        ))}
      </div>

      <div className={s.bottom}>
        <div className={s.bottomWrap}>
          {hasError ? (
            <div className={s.bottomTextWrap}>
              <p className={s.bottomTitle}>
                Произошла ошибка обновления корзины
              </p>
            </div>
          ) : (
            <div className={s.bottomTextWrap}>
              <p className={s.bottomTitle}>Итого</p>
              <div className={s.line} />
              <p className={cn(s.bottomPrice, isCartQuery && s.loading)}>
                {totalAmount}
              </p>
            </div>
          )}
          {hasError ? (
            <Button
              onClick={refetchCart}
              className={s.orderBtn}
              size="l"
              loading={isCartLoading}
            >
              Повторить
            </Button>
          ) : (
            <Button
              href={PageConfig.CHECKOUT}
              className={s.orderBtn}
              size="l"
              loading={isCartQuery}
            >
              Оформить заказ
              <Arrow className={s.orderIcon} />
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
