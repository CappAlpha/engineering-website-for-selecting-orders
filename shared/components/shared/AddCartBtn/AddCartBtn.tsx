import { type FC } from "react";

import { Button } from "@/components/ui/Button";

import { ShoppingCart, Arrow } from "../../../../public/icon";

import s from "./AddCartBtn.module.scss";

export const AddCartBtn: FC = () => {
  return (
    <Button className={s.root}>
      0 ₽ <span className={s.separator} />
      <ShoppingCart className={s.cartIcon} />
      <span className={s.count}>0</span>
      <Arrow className={s.arrowIcon} />
    </Button>
  );
};
