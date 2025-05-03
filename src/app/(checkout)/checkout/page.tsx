import { OrderItemContainer } from "@/modules/Order/ui/OrderContainer";

import s from "./page.module.scss";

export default async function Home() {
  return (
    <div className={s.wrap}>
      <h1 className={s.title}>Оформление заказа</h1>
      <OrderItemContainer title="1. Корзина" isCart>
        123
      </OrderItemContainer>
      <OrderItemContainer title="2. Персональная информация">
        1234
      </OrderItemContainer>
      <OrderItemContainer title="3. Адрес доставки">12345</OrderItemContainer>
    </div>
  );
}
