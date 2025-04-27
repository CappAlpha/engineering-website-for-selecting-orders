"use client";

import { Drawer } from "@mui/material";
import cn from "classnames";
import { type FC } from "react";

import { QuantityActionType } from "@/constants/cart";
import { CartState } from "@/store/cart/cartSlice";

import { EmptyCartDrawer } from "./EmptyCartDrawer";
import { ListCartDrawer } from "./ListCartDrawer";

import s from "./CartDrawer.module.scss";

export interface Props
  extends Omit<
    CartState,
    "loadingFetch" | "loadingAdd" | "errorFetch" | "errorAdd"
  > {
  open: boolean;
  toggleDrawer: (value: boolean) => () => void;
  handleQuantityChange: (
    id: number,
    quantity: number,
    type: QuantityActionType,
  ) => void;
  onClickRemove: (id: number) => void;
}

export const CartDrawer: FC<Props> = ({
  open,
  loadingUpdate,
  errorUpdate,
  loadingRemove,
  errorRemove,
  totalAmount,
  items,
  toggleDrawer,
  handleQuantityChange,
  onClickRemove,
}) => {
  const isEmpty = items.length === 0;

  return (
    <div className={s.root}>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        anchor="right"
        className={s.drawer}
      >
        <div className={cn(s.wrap, !isEmpty && s.listWrap)}>
          {isEmpty ? (
            <EmptyCartDrawer onClose={toggleDrawer(false)} />
          ) : (
            <ListCartDrawer
              loadingUpdate={loadingUpdate}
              errorUpdate={errorUpdate}
              loadingRemove={loadingRemove}
              errorRemove={errorRemove}
              totalAmount={totalAmount}
              items={items}
              onClose={toggleDrawer(false)}
              onChangeCount={handleQuantityChange}
              onClickRemove={onClickRemove}
            />
          )}
        </div>
      </Drawer>
    </div>
  );
};
