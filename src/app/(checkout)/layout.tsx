import { Metadata } from "next";
import { type ReactNode } from "react";

import { Footer } from "@/shared/ui/Footer";
import { Header } from "@/shared/ui/Header";

import s from "./layout.module.scss";

export const metadata: Metadata = {
  title: "Оформление заказа | Engineer",
};

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Header isCheckoutPage />
      <main className={s.container}>{children}</main>
      <Footer />
    </>
  );
}
