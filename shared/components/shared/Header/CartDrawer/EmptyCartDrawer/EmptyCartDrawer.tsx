"use client";

import Image from "next/image";
import { type FC } from "react";

import { Button } from "@/components/ui/Button";

import { Arrow } from "../../../../../../public/icon";
import { Props } from "../CartDrawer";

import s from "./EmptyCartDrawer.module.scss";

export const EmptyCartDrawer: FC<Pick<Props, "toggleDrawer">> = ({
  toggleDrawer,
}) => {
  return (
    <>
      <div className={s.imgWrap}>
        <Image src="/images/cart/1.webp" alt="Корзина" fill className={s.img} />
      </div>
      <h3 className={s.title}>Корзина пустая</h3>
      <p className={s.description}>
        Добавьте хотя бы одну пиццу, чтобы совершить заказ
      </p>
      <Button onClick={toggleDrawer(false)}>
        <Arrow className={s.icon} />
        Вернуться назад
      </Button>
    </>
  );
};
