"use client";

import { useEffect, useState, type FC } from "react";
import { useDispatch } from "react-redux";

import { fetchCartItems } from "@/modules/Cart/store/cartSlice";
import { useAppSelector } from "@/shared/hook/useAppSelector";
import { Button } from "@/shared/ui/Button";
import { AppDispatch } from "@/store/store";

import { ShoppingCart, Arrow } from "../../../../../public/icon";
import {
  selectCartItemsCount,
  selectCartLoading,
  selectTotalAmount,
} from "../../store/cartSelectors";
import { CartDrawer } from "../CartDrawer";

import s from "./CartBtn.module.scss";

export const CartBtn: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const productsInCartCount = useAppSelector(selectCartItemsCount);
  const totalAmount = useAppSelector(selectTotalAmount);
  const loading = useAppSelector(selectCartLoading);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

  const isCartEmpty = totalAmount === 0;
  const isLoading =
    loading.fetch ||
    Object.values(loading.update).some(Boolean) ||
    Object.values(loading.add).some(Boolean) ||
    Object.values(loading.remove).some(Boolean);

  return (
    <>
      <Button
        className={s.root}
        loading={isLoading}
        onClick={toggleDrawer(true)}
        aria-label={`Открыть корзину с ${productsInCartCount} товарами`}
      >
        {totalAmount} &#8381; <span className={s.separator} />
        <ShoppingCart className={s.cartIcon} />
        <span className={s.count}>{productsInCartCount}</span>
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
