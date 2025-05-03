"use client";

import { useEffect, type FC } from "react";
import { useDispatch } from "react-redux";

import { useCartReducers } from "@/modules/Cart/actions/useCartReducers";
import { selectAllCartItems } from "@/modules/Cart/store/cartSelectors";
import { fetchCartItems } from "@/modules/Cart/store/cartSlice";
import { ProductCardLine } from "@/modules/Cart/ui/ProductCardLine";
import { useAppSelector } from "@/shared/hook/useAppSelector";
import { AppDispatch } from "@/store/store";

import { DeliveryAddress } from "../DeliveryAddress";
import { OrderItem } from "../OrderItem/OrderItem";
import { PaymentSidebar } from "../PaymentSidebar";
import { PersonalInformation } from "../PersonalInformation";

import s from "./OrderItems.module.scss";

export const OrderItems: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useAppSelector(selectAllCartItems);
  const { handleQuantityChange, handleRemove } = useCartReducers();

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  return (
    <div className={s.root}>
      <div className={s.left}>
        <OrderItem title="1. Корзина" isCart>
          {cartItems.map((item) => (
            <ProductCardLine
              key={item.name}
              item={item}
              onChangeCount={(type) =>
                handleQuantityChange(item.id, item.quantity, type)
              }
              onClickRemove={() => handleRemove(item.id)}
            />
          ))}
        </OrderItem>
        <OrderItem title="2. Персональная информация">
          <PersonalInformation />
        </OrderItem>
        <OrderItem title="3. Адрес доставки">
          <DeliveryAddress />
        </OrderItem>
      </div>
      <div className={s.right}>
        <PaymentSidebar />
      </div>
    </div>
  );
};
