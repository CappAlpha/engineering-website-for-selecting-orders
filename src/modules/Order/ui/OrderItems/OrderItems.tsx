"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect, useState, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { createOrder } from "@/app/actions";
import { useCartReducers } from "@/modules/Cart/services/useCartReducers";
import {
  selectAllCartItems,
  selectCartLoading,
} from "@/modules/Cart/store/cartSelectors";
import { ProductCardLine } from "@/modules/Cart/ui/ProductCardLine";
import { ProductCardLineSkeleton } from "@/modules/Cart/ui/ProductCardLine/ProductCardLineSkeleton";
import { getUserInfo } from "@/modules/Order/services/getUserInfo";
import { useAppSelector } from "@/shared/hook/useAppSelector";
import { noop } from "@/shared/lib/noop";
import { Button } from "@/shared/ui/Button";

import {
  CheckoutFormValues,
  checkoutFormSchema,
} from "../../schemas/checkoutFormSchema";
import { DeliveryForm } from "../DeliveryForm";
import { OrderItem } from "../OrderItem";
import { PaymentSidebar } from "../PaymentSidebar";
import { PersonalForm } from "../PersonalForm";

import s from "./OrderItems.module.scss";

export const OrderItems: FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const cartItems = useAppSelector(selectAllCartItems);
  const cartLoading = useAppSelector(selectCartLoading);
  const { fetchCart, handleQuantityChange, handleRemove } = useCartReducers();
  const { data: session } = useSession();
  const [error, setError] = useState(false);

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

  useEffect(() => {
    if (session) {
      getUserInfo(setError, form);
    }

    if (error) console.error("[ORDER_ITEMS] Get user error", error);
  }, [session, form, setError]);

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      setSubmitting(true);

      const url = await createOrder(data);

      toast.success("Заказ успешно создан! Переход на оплату...", {
        icon: "\u2705",
      });

      if (url) {
        location.href = url;
      }
    } catch (err) {
      console.error("Error creating order [CREATE_ORDER]", err);
      setSubmitting(false);
      toast.error("Не удалось создать заказ", {
        icon: "\u274C",
      });
    }
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      fetchCart();
    }
  }, [cartItems.length]);

  const isEmpty = cartItems.length === 0;
  const isCartFetching = cartLoading.fetch;
  const isCardChanging =
    Object.values(cartLoading.update).some(Boolean) ||
    Object.values(cartLoading.remove).some(Boolean);

  return (
    <FormProvider {...form}>
      <form
        className={s.root}
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <div className={s.left}>
          <OrderItem
            title="1. Корзина"
            isCartEmpty={!isEmpty}
            loading={isCartFetching}
            handleClearAll={noop}
          >
            {isCartFetching ? (
              Array.from({
                length: cartItems.length !== 0 ? cartItems.length : 3,
              }).map((_, index) => <ProductCardLineSkeleton key={index} />)
            ) : !isCartFetching && isEmpty ? (
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
          <OrderItem title="2. Персональная информация" disabled={isEmpty}>
            <PersonalForm />
          </OrderItem>
          <OrderItem title="3. Адрес доставки" disabled={isEmpty}>
            <DeliveryForm />
          </OrderItem>
        </div>
        <div className={s.right}>
          <PaymentSidebar
            loading={isCartFetching || isCardChanging || submitting}
            disabled={isEmpty}
          />
        </div>
      </form>
    </FormProvider>
  );
};
