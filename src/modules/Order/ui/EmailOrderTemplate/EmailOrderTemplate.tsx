import { type FC } from "react";

export interface EmailOrderTemplateProps {
  orderId: number;
  totalAmount: number;
  paymentUrl: string;
}

export const EmailOrderTemplate: FC<EmailOrderTemplateProps> = ({
  orderId,
  totalAmount,
  paymentUrl,
}) => {
  return (
    <div>
      <h1>Заказ #{orderId}!</h1>

      <p>
        Оплатите заказ на сумму <b>{totalAmount}</b> &#8381;. Перейдите{" "}
        <a href={paymentUrl}>по этой ссылке</a> для оплаты заказа
      </p>

      {/* TODO: выводить предметы заказа */}
    </div>
  );
};
