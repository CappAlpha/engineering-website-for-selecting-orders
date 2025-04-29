"use client";

import { Fragment, useEffect, useState, type FC } from "react";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/Button";
import { useCart } from "@/hook/useCart";
import { fetchCartItems } from "@/store/cart/cartSlice";
import { AppDispatch } from "@/store/store";

import { ShoppingCart, Arrow } from "../../../../public/icon";
import { CartDrawer } from "../CartDrawer";
import { EmptyCartDrawer } from "../CartDrawer/EmptyCartDrawer";
import { ListCartDrawer } from "../CartDrawer/ListCartDrawer";

import s from "./CartBtn.module.scss";

export const CartBtn: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items,
    totalAmount,

    loadingRemoveId,

    loadingFetch,
    loadingUpdate,
    loadingAdd,
    loadingRemove,

    errorFetch,
    errorUpdate,
    errorAdd,
    errorRemove,

    handleQuantityChange,
    handleRemove,
  } = useCart();
  const [open, setOpen] = useState(false);

  //TODO: change on React Query?
  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

  const isEmpty = items.length === 0;

  return (
    <>
      <Button
        className={s.root}
        loading={loadingFetch || loadingUpdate || loadingAdd || loadingRemove}
        disabled={Boolean(errorAdd)}
        onClick={toggleDrawer(true)}
        aria-label={`Открыть корзину с ${items.length} товарами`}
      >
        {errorFetch || errorUpdate || errorAdd || errorRemove ? (
          <Fragment key="layout">Ошибка</Fragment>
        ) : (
          <Fragment key="layout">
            {totalAmount} &#8381; <span className={s.separator} />
            <ShoppingCart className={s.cartIcon} />
            <span className={s.count}>{items.length}</span>
            <Arrow className={s.arrowIcon} />
          </Fragment>
        )}
      </Button>
      <CartDrawer open={open} toggleDrawer={toggleDrawer}>
        {isEmpty ? (
          <EmptyCartDrawer onClose={toggleDrawer(false)} />
        ) : (
          <ListCartDrawer
            items={items}
            totalAmount={totalAmount}
            loadingRemoveId={loadingRemoveId}
            loadingUpdate={loadingUpdate}
            errorUpdate={errorUpdate}
            loadingRemove={loadingRemove}
            errorRemove={errorRemove}
            onClose={toggleDrawer(false)}
            onChangeCount={handleQuantityChange}
            onClickRemove={handleRemove}
          />
        )}
      </CartDrawer>
    </>
  );
};
