"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { useCartReducers } from "@/modules/Cart/actions/useCartReducers";
import {
  selectAllCartItems,
  selectCartLoading,
} from "@/modules/Cart/store/cartSelectors";
import { fetchCartItems } from "@/modules/Cart/store/cartSlice";
import { ProductCardLine } from "@/modules/Cart/ui/ProductCardLine";
import { ProductCardLineSkeleton } from "@/modules/Cart/ui/ProductCardLine/ProductCardLineSkeleton";
import { useAppSelector } from "@/shared/hook/useAppSelector";
import { noop } from "@/shared/lib/noop";
import { Button } from "@/shared/ui/Button";
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
  const loading = useAppSelector(selectCartLoading);
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
    reValidateMode: "onBlur",
  });

  const onSubmit = (data: CheckoutFormValues) => {
    console.log(data);
  };

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const isEmpty = cartItems.length === 0;
  const isLoading =
    loading.fetch || Object.values(loading.remove).some(Boolean);
  const isUpdate = Object.values(loading.update).some(Boolean);

  return (
    <FormProvider {...form}>
      <form className={s.root} onSubmit={form.handleSubmit(onSubmit)}>
        <div className={s.left}>
          <OrderItem
            title="1. Корзина"
            isCart={!isEmpty}
            loading={isLoading}
            handleClearAll={noop}
          >
            {isLoading ? (
              Array.from({
                length: cartItems.length !== 0 ? cartItems.length : 3,
              }).map((_, index) => <ProductCardLineSkeleton key={index} />)
            ) : !isLoading && isEmpty ? (
              <div className={s.empty}>
                <p className={s.emptyText}>
                  Корзина пуста вернитесь обратно в Каталог
                </p>
                <Button className={s.catalogBtn} href="/">
                  Каталог
                </Button>
              </div>
            ) : (
              cartItems.map((item) => (
                <ProductCardLine
                  key={item.name}
                  item={item}
                  onChangeCount={(type) =>
                    handleQuantityChange(item.id, item.quantity, type)
                  }
                  onClickRemove={() => handleRemove(item.id)}
                />
              ))
            )}
          </OrderItem>
          <OrderItem title="2. Персональная информация">
            <PersonalForm />
          </OrderItem>
          <OrderItem title="3. Адрес доставки">
            <DeliveryForm />
          </OrderItem>
        </div>
        <div className={s.right}>
          <PaymentSidebar loading={isLoading || isUpdate} />
        </div>
      </form>
    </FormProvider>
  );
};
