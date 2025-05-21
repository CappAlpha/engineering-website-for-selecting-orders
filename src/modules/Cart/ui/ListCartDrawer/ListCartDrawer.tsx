"use client";

import cn from "classnames";
import { type FC } from "react";

import {
  selectAllCartItems,
  selectCartErrors,
  selectCartLoading,
  selectTotalAmount,
} from "@/modules/Cart/store/cartSelectors";
import { PageConfig } from "@/shared/constants/pages";
import { useAppSelector } from "@/shared/hook/useAppSelector";
import { pluralize } from "@/shared/lib/pluralize";
import { Button } from "@/shared/ui/Button";

import { Plus, Arrow } from "../../../../../public/icon";
import { useCartReducers } from "../../services/useCartReducers";
import { ProductCardLine } from "../ProductCardLine";

import s from "./ListCartDrawer.module.scss";

interface ListCardDrawerProps {
  onClose?: VoidFunction;
}

export const ListCartDrawer: FC<ListCardDrawerProps> = ({ onClose }) => {
  const cartItems = useAppSelector(selectAllCartItems);
  const totalAmount = useAppSelector(selectTotalAmount);
  const loading = useAppSelector(selectCartLoading);
  const error = useAppSelector(selectCartErrors);

  const { fetchCart, handleQuantityChange, handleRemove } = useCartReducers();

  const getPluralizeGoods = pluralize("товар", "товара", "товаров");
  const productsInCartCount = cartItems.length;

  const isProcessing =
    Object.values(loading.update).some(Boolean) ||
    Object.values(loading.remove).some(Boolean);
  const hasError = error.update;

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
          <ProductCardLine
            key={item.name}
            item={item}
            onChangeCount={(type) =>
              handleQuantityChange(item.id, item.quantity, type)
            }
            onClickRemove={() => handleRemove(item.id)}
          />
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
              <p className={cn(s.bottomPrice, isProcessing && s.loading)}>
                {totalAmount}
              </p>
            </div>
          )}
          {hasError ? (
            <Button
              onClick={fetchCart}
              className={s.orderBtn}
              size="l"
              loading={Object.values(loading.fetch).some(Boolean)}
            >
              Повторить
            </Button>
          ) : (
            <Button
              href={PageConfig.CHECKOUT}
              className={s.orderBtn}
              size="l"
              loading={isProcessing}
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
