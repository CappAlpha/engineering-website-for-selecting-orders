import { Metadata } from "next";
import { type ReactNode } from "react";

import { Footer } from "@/shared/ui/Footer";
import { Header } from "@/shared/ui/Header";

import s from "./layout.module.scss";

export const metadata: Metadata = {
  title: "Профиль | Engineer",
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className={s.container}>{children}</main>
      <Footer />
    </>
  );
}
