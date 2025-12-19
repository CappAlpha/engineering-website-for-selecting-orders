"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect, useState, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { createOrder } from "@/app/actions";
import { useCartQueries } from "@/modules/Cart/hooks/useCartQueries";
import { ProductCardLine } from "@/modules/Cart/ui/ProductCardLine";
import { ProductCardLineSkeleton } from "@/modules/Cart/ui/ProductCardLine/ProductCardLineSkeleton";
import { getUserInfo } from "@/modules/Order/services/getUserInfo";
import { Button } from "@/shared/ui/Button";

import type { CheckoutFormValues } from "../../schemas/checkoutFormSchema";
import { checkoutFormSchema } from "../../schemas/checkoutFormSchema";
import { DeliveryForm } from "../DeliveryForm";
import { OrderItem } from "../OrderItem";
import { PaymentSidebar } from "../PaymentSidebar";
import { PersonalForm } from "../PersonalForm";

import s from "./OrderItems.module.scss";

export const OrderItems: FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const {
    totalAmount,
    cartItems,
    isCartLoading,
    handleRemoveAll,
    isCartClearing,
  } = useCartQueries();
  const { status } = useSession();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      comment: "",
      time: "",
    },
  });

  const { watch } = form;
  const address = watch("address");

  const isCartEmpty = totalAmount === 0;

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
      toast.error(
        err instanceof Error ? err.message : "Не удалось создать заказ",
        {
          icon: "\u274C",
        },
      );
    }
  };

  useEffect(() => {
    if (status !== "authenticated" || isCartEmpty || error) return;

    const controller = new AbortController();

    void getUserInfo(form, controller.signal, setError);

    return () => {
      controller.abort();
    };
  }, [status, isCartEmpty, form, error, setError]);

  return (
    <FormProvider {...form}>
      <form
        className={s.root}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <div className={s.left}>
          <OrderItem
            title="1. Корзина"
            isCartEmpty={!isCartEmpty}
            loading={isCartClearing}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            handleClearCart={handleRemoveAll}
          >
            {isCartLoading ? (
              Array.from({
                length: cartItems.length !== 0 ? cartItems.length : 3,
              }).map((_, index) => <ProductCardLineSkeleton key={index} />)
            ) : !isCartLoading && isCartEmpty ? (
              <div className={s.empty}>
                <p className={s.emptyText}>Корзина пуста</p>
                <Button className={s.catalogBtn} href="/">
                  Каталог
                </Button>
              </div>
            ) : (
              cartItems.map((item) => (
                <ProductCardLine key={item.name} item={item} />
              ))
            )}
          </OrderItem>
          <OrderItem title="2. Персональная информация" disabled={isCartEmpty}>
            <PersonalForm />
          </OrderItem>
          <OrderItem title="3. Адрес доставки" disabled={isCartEmpty}>
            <DeliveryForm />
          </OrderItem>
        </div>
        <div className={s.right}>
          <PaymentSidebar
            isAddressEmpty={address === ""}
            submitting={submitting}
            disabled={isCartEmpty}
          />
        </div>
      </form>
    </FormProvider>
  );
};
