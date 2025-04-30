"use client";

import { Fragment, useEffect, useState, type FC } from "react";
import { useDispatch } from "react-redux";

import { fetchCartItems } from "@/features/Cart/store/cartSlice";
import { Button } from "@/shared/ui/Button";
import { AppDispatch } from "@/store/store";

import { ShoppingCart, Arrow } from "../../../../../public/icon";
import { useCart } from "../../actions/useCart";
import { CartDrawer } from "../CartDrawer";

import s from "./CartBtn.module.scss";

export const CartBtn: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items,
    totalAmount,

    loadingFetch,
    loadingUpdate,
    loadingAdd,
    loadingRemove,
  } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

  const isCartEmpty = totalAmount === 0;

  return (
    <>
      <Button
        className={s.root}
        loading={loadingFetch || loadingUpdate || loadingAdd || loadingRemove}
        onClick={toggleDrawer(true)}
        aria-label={`Открыть корзину с ${items.length} товарами`}
      >
        <Fragment key="layout">
          {totalAmount} &#8381; <span className={s.separator} />
          <ShoppingCart className={s.cartIcon} />
          <span className={s.count}>{items.length}</span>
          <Arrow className={s.arrowIcon} />
        </Fragment>
      </Button>
      <CartDrawer
        open={open}
        isCartEmpty={isCartEmpty}
        toggleDrawer={toggleDrawer}
      />
    </>
  );
};
