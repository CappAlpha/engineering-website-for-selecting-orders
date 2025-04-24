"use client";

import { Fragment, type FC } from "react";

import { ProductCardLine } from "@/components/shared/ProductCardLine";
import { Button } from "@/components/ui/Button";
import { QuantityActionType } from "@/constants/cart";
import { CartState } from "@/store/cart/cartSlice";
import { pluralize } from "@/utils/pluralize";

import { Arrow, Plus } from "../../../../../public/icon";

import s from "./ListCartDrawer.module.scss";

interface Props extends CartState {
  onClose: () => void;
  onChangeCount: (
    id: number,
    quantity: number,
    type: QuantityActionType,
  ) => void;
  onClickRemove: (id: number) => void;
}

export const ListCartDrawer: FC<Props> = ({
  loading,
  error,
  totalAmount,
  items,
  onClose,
  onChangeCount,
  onClickRemove,
}) => {
  const getPluralizeGoods = pluralize("товар", "товара", "товаров");
  const productsLength = items.length;

  return (
    <>
      <div className={s.top}>
        <p className={s.topInfo}>
          В корзине{" "}
          <b>
            {productsLength} {getPluralizeGoods(productsLength)}
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
        {items.map((item) => (
          <ProductCardLine
            key={item.name}
            loading={loading}
            item={item}
            onChangeCount={(type) =>
              onChangeCount(item.id, item.quantity, type)
            }
            onClickRemove={() => onClickRemove(item.id)}
          />
        ))}
      </div>

      <div className={s.bottom}>
        <div className={s.bottomWrap}>
          <div className={s.bottomTextWrap}>
            <p className={s.bottomTitle}>Итого</p>
            <div className={s.line} />
            <p className={s.bottomPrice}>{totalAmount}</p>
          </div>
          {!error && (
            <Button
              onClick={onClose}
              className={s.orderBtn}
              size="l"
              key="cartBtn"
            >
              {loading ? (
                <Fragment key="cartBtnContent">Загрузка...</Fragment>
              ) : (
                <Fragment key="cartBtnContent">
                  Оформить заказ
                  <Arrow className={s.orderIcon} />
                </Fragment>
              )}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
