"use client";

import { useState, type FC } from "react";

import { Button } from "@/components/ui/Button";

import { ShoppingCart, Arrow } from "../../../../public/icon";
import { CartDrawer } from "../Header/CartDrawer";

import s from "./AddCartBtn.module.scss";

export const AddCartBtn: FC = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      <Button className={s.root} onClick={toggleDrawer(true)}>
        0 ₽ <span className={s.separator} />
        <ShoppingCart className={s.cartIcon} />
        <span className={s.count}>0</span>
        <Arrow className={s.arrowIcon} />
      </Button>
      <CartDrawer open={open} toggleDrawer={toggleDrawer} />
    </>
  );
};
