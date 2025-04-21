"use client";

import { type FC } from "react";

import { Button } from "@/components/ui/Button";

import { Arrow, Plus } from "../../../../../../public/icon";
import { Props } from "../CartDrawer";

import s from "./ListCartDrawer.module.scss";

export const ListCartDrawer: FC<Pick<Props, "toggleDrawer">> = ({
  toggleDrawer,
}) => {
  return (
    <>
      <div className={s.top}>
        <p className={s.topInfo}>
          В корзине <b>3 товара</b>
        </p>
        <Button
          color="transparent"
          onClick={toggleDrawer(false)}
          noPadding
          className={s.close}
        >
          <Plus className={s.icon} />
        </Button>
      </div>

      <div className={s.items}></div>

      <div className={s.bottom}>
        <div className={s.bottomWrap}>
          <div className={s.bottomTextWrap}>
            <p className={s.bottomTitle}>Итого</p>
            <div className={s.line} />
            <p className={s.bottomPrice}>2245 ₽</p>
          </div>
          <div className={s.bottomTextWrap}>
            <p className={s.bottomTitle}>Налог 5%</p>
            <div className={s.line} />
            <p className={s.bottomPrice}>112 ₽</p>
          </div>
          <Button onClick={toggleDrawer(false)} className={s.orderBtn} size="l">
            Оформить заказ
            <Arrow className={s.orderIcon} />
          </Button>
        </div>
      </div>
    </>
  );
};
