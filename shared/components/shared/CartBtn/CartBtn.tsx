"use client";

import { Fragment, useEffect, useState, type FC } from "react";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/Button";
import { useCart } from "@/hook/useCart";
import { fetchCartItems } from "@/store/cart/cartSlice";
import { AppDispatch } from "@/store/store";

import { ShoppingCart, Arrow } from "../../../../public/icon";
import { CartDrawer } from "../CartDrawer";

import s from "./CartBtn.module.scss";

export const CartBtn: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    loading,
    error,
    totalAmount,
    items,
    handleQuantityChange,
    handleRemove,
  } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

  return (
    <>
      <Button
        className={s.root}
        loading={loading}
        disabled={Boolean(error)}
        onClick={toggleDrawer(true)}
        aria-label={`Открыть корзину с ${items.length} товарами`}
      >
        {loading ? (
          <Fragment key="layout">Загрузка...</Fragment>
        ) : error ? (
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
      <CartDrawer
        open={open}
        loading={loading}
        error={error}
        totalAmount={totalAmount}
        items={items}
        toggleDrawer={toggleDrawer}
        handleQuantityChange={handleQuantityChange}
        onClickRemove={handleRemove}
      />
    </>
  );
};
