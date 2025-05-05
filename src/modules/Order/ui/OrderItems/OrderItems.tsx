"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { useCartReducers } from "@/modules/Cart/actions/useCartReducers";
import { selectAllCartItems } from "@/modules/Cart/store/cartSelectors";
import { fetchCartItems } from "@/modules/Cart/store/cartSlice";
import { ProductCardLine } from "@/modules/Cart/ui/ProductCardLine";
import { useAppSelector } from "@/shared/hook/useAppSelector";
import { AppDispatch } from "@/store/store";

import {
  CheckoutFormValues,
  checkoutFormSchema,
} from "../../schemas/checkoutFormSchema";
import { DeliveryForm } from "../DeliveryForm";
import { OrderItem } from "../OrderItem/OrderItem";
import { PaymentSidebar } from "../PaymentSidebar";
import { PersonalForm } from "../PersonalForm";

import s from "./OrderItems.module.scss";

export const OrderItems: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useAppSelector(selectAllCartItems);
  const { handleQuantityChange, handleRemove } = useCartReducers();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      comment: "",
    },
  });

  const onSubmit = (data: CheckoutFormValues) => {
    console.log(data);
  };

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  return (
    <FormProvider {...form}>
      <form className={s.root} onSubmit={form.handleSubmit(onSubmit)}>
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
            <PersonalForm />
          </OrderItem>
          <OrderItem title="3. Адрес доставки">
            <DeliveryForm />
          </OrderItem>
        </div>
        <div className={s.right}>
          <PaymentSidebar />
        </div>
      </form>
    </FormProvider>
  );
};
