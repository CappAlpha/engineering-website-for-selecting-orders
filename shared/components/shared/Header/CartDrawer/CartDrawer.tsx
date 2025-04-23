"use client";

import { Drawer } from "@mui/material";
import cn from "classnames";
import { useEffect, type FC } from "react";
import { useDispatch } from "react-redux";

import { useAppSelector } from "@/hook/useAppSelector";
import { fetchCartItems, cartActions } from "@/store/cart/cartSlice";
import { AppDispatch } from "@/store/store";

import { EmptyCartDrawer } from "./EmptyCartDrawer";
import { ListCartDrawer } from "./ListCartDrawer";

import s from "./CartDrawer.module.scss";

export interface Props {
  open: boolean;
  toggleDrawer: (value: boolean) => () => void;
}

export const CartDrawer: FC<Props> = ({ open, toggleDrawer }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, totalAmount, items } = useAppSelector(
    (state) => state.cart,
  );

  useEffect(() => {
    dispatch(fetchCartItems());

    return () => {
      dispatch(cartActions.resetError());
    };
  }, [dispatch]);

  const isEmpty = items.length === 0;

  const renderDrawerContent = isEmpty ? (
    <EmptyCartDrawer toggleDrawer={toggleDrawer} />
  ) : (
    <ListCartDrawer
      toggleDrawer={toggleDrawer}
      loading={loading}
      error={error}
      totalAmount={totalAmount}
      items={items}
    />
  );

  return (
    <div className={s.root}>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        anchor="right"
        className={s.drawer}
      >
        <div className={cn(s.wrap, !isEmpty && s.listWrap)}>
          {renderDrawerContent}
        </div>
      </Drawer>
    </div>
  );
};
