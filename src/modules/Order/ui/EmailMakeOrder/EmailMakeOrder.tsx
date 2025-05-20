import { type FC } from "react";

import { CartItemDTO } from "@/modules/Cart/entities/cart";

import s from "./EmailMakeOrder.module.scss";

interface Props {
  orderId: number;
  totalAmount: number;
  paymentUrl: string;
  items: CartItemDTO[];
}

export const EmailMakeOrder: FC<Props> = ({
  orderId,
  totalAmount,
  paymentUrl,
  items,
}) => {
  return (
    <div className={s.root}>
      <h1>Заказ #{orderId}!</h1>

      <p>
        Оплатите заказ на сумму <b>{totalAmount}</b> &#8381;. Перейдите{" "}
        <a href={paymentUrl}>по этой ссылке</a> для оплаты заказа
      </p>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.product.name} | {item.product.price} &#8381; x {item.quantity}{" "}
            шт. = {item.product.price * item.quantity} &#8381;
          </li>
        ))}
      </ul>
    </div>
  );
};
