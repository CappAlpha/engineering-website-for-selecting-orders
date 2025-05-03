"use client";

import { type FC } from "react";

import { selectTotalAmount } from "@/modules/Cart/store/cartSelectors";
import { useAppSelector } from "@/shared/hook/useAppSelector";
import { Button } from "@/shared/ui/Button";

import { Goods, Shipping } from "../../../../../public/icon";

import s from "./Payment.module.scss";

export const Payment: FC = () => {
  const totalAmount = useAppSelector(selectTotalAmount);

  return (
    <div className={s.root}>
      <div className={s.header}>
        <p className={s.total}>Итого:</p>
        <p className={s.totalAmount}>{totalAmount} &#8381;</p>
      </div>
      <div className={s.content}>
        <div className={s.item}>
          <Goods className={s.contentIcon} />
          <p className={s.contentTitle}>Итого</p>
          <div className={s.line} />
          <p className={s.contentPrice}>{totalAmount} &#8381;</p>
        </div>
        <div className={s.item}>
          <Shipping className={s.contentIcon} />
          <p className={s.contentTitle}>Доставка</p>
          <div className={s.line} />
          <p className={s.contentPrice}>120 &#8381;</p>
        </div>
      </div>
      {/* TODO: add promo code? */}
      {/* <Button className={s.promoCodeBtn} color="transparent" noPadding>
        У меня есть промокод
      </Button> */}
      <Button className={s.paymentBtn}>Перейти к оплате</Button>
    </div>
  );
};
