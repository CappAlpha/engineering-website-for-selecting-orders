"use client";

import Image from "next/image";
import { type FC } from "react";

import { Button } from "@/shared/ui/Button";

import { Arrow } from "../../../../../public/icon";

import s from "./EmptyCartDrawer.module.scss";

interface Props {
  onClose: VoidFunction;
}

export const EmptyCartDrawer: FC<Props> = ({ onClose }) => {
  return (
    <>
      <div className={s.imgWrap}>
        <Image
          src="/images/cart/1.webp"
          alt="Корзина"
          fill
          className={s.img}
          preload
          priority={false}
        />
      </div>
      <h3 className={s.title}>Корзина пустая</h3>
      <p className={s.description}>
        Добавьте хотя бы одну услугу, чтобы совершить заказ
      </p>
      <Button onClick={onClose}>
        <Arrow className={s.icon} />
        Вернуться назад
      </Button>
    </>
  );
};
