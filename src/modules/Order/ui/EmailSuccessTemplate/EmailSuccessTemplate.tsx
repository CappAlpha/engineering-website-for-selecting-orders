import { type FC } from "react";

import { CartItemDTO } from "@/modules/Cart/entities/cart";

export interface EmailSuccessTemplateProps {
  orderId: number;
  items: CartItemDTO[];
}

export const EmailSuccessTemplate: FC<EmailSuccessTemplateProps> = ({
  orderId,
  items,
}) => {
  return (
    <div>
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
