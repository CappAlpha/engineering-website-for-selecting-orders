import { OrderItems } from "@/modules/Order/ui/OrderItems";

import s from "./page.module.scss";

export default async function CheckoutPage() {
  return (
    <div className={s.wrap}>
      <h1 className={s.title}>Оформление заказа</h1>
      <OrderItems />
    </div>
  );
}
