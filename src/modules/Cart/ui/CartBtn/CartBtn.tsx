"use client";

import { useState, type FC } from "react";

import { Button } from "@/shared/ui/Button";

import { Arrow, ShoppingCart } from "../../../../../public/icon";
import { useCartQueries } from "../../hooks/useCartQueries";
import { CartDrawer } from "../CartDrawer";

import s from "./CartBtn.module.scss";

export const CartBtn: FC = () => {
  const { totalAmount, cartItems, isCartLoading, isCartQuery } =
    useCartQueries();

  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

  const isCartEmpty = totalAmount === 0;
  const isLoading = isCartLoading || isCartQuery;

  return (
    <>
      <Button
        className={s.root}
        loading={isLoading}
        onClick={toggleDrawer(true)}
        aria-label={`Открыть корзину с ${cartItems.length} товарами`}
      >
        {totalAmount} &#8381;
        {!isLoading && <div className={s.line} />}
        <ShoppingCart className={s.cartIcon} />
        <span className={s.count}>{cartItems.length}</span>
        <Arrow className={s.arrowIcon} />
      </Button>
      <CartDrawer
        open={open}
        isCartEmpty={isCartEmpty}
        toggleDrawer={toggleDrawer}
      />
    </>
  );
};
