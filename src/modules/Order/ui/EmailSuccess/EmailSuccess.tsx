import { type FC } from "react";

import { CartItemDTO } from "@/modules/Cart/entities/cart";

import s from "./EmailSuccess.module.scss";

interface Props {
  orderId: number;
  items: CartItemDTO[];
}

export const EmailSuccess: FC<Props> = ({ orderId, items }) => {
  return (
    <div className={s.root}>
      <h1>Спасибо за покупку!</h1>

      <p>Ваш заказ #{orderId} оплачен. Список товаров:</p>

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
