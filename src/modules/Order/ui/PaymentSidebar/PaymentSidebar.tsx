"use client";

import cn from "classnames";
import { type FC } from "react";

import { selectTotalAmount } from "@/modules/Cart/store/cartSelectors";
import { useAppSelector } from "@/shared/hook/useAppSelector";
import { Button } from "@/shared/ui/Button";

import { Goods, Percentage, Shipping } from "../../../../../public/icon";

import s from "./PaymentSidebar.module.scss";

const TAX_PERCENTAGE = 15;

interface Props {
  loading: boolean;
}

export const PaymentSidebar: FC<Props> = ({ loading }) => {
  const totalAmount = useAppSelector(selectTotalAmount);

  const taxPrice = (totalAmount * TAX_PERCENTAGE) / 100;
  const deliveryPrice = 120;

  const totalPrice = totalAmount + taxPrice + deliveryPrice;

  return (
    <div className={s.root}>
      <div className={s.header}>
        <p className={s.total}>Итого:</p>
        <p className={cn(s.totalAmount, loading && s.loading)}>
          {totalPrice} &#8381;
        </p>
      </div>
      <div className={s.content}>
        <div className={s.item}>
          <Goods className={s.contentIcon} />
          <p className={s.contentTitle}>Стоимость корзины:</p>
          <div className={s.line} />
          <p className={cn(s.contentPrice, loading && s.loading)}>
            {totalAmount} &#8381;
          </p>
        </div>
        <div className={s.item}>
          <Percentage className={s.contentIcon} />
          <p className={s.contentTitle}>Налог:</p>
          <div className={s.line} />
          <p className={cn(s.contentPrice, loading && s.loading)}>
            {taxPrice} &#8381;
          </p>
        </div>
        <div className={s.item}>
          <Shipping className={s.contentIcon} />
          <p className={s.contentTitle}>Доставка:</p>
          <div className={s.line} />
          <p className={s.contentPrice}>{deliveryPrice} &#8381;</p>
        </div>
      </div>
      {/* TODO: add promo code? */}
      {/* <Button className={s.promoCodeBtn} color="transparent" noPadding>
        У меня есть промокод
      </Button> */}
      <Button className={s.paymentBtn} type="submit">
        Перейти к оплате
      </Button>
    </div>
  );
};
