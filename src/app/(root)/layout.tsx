import { Metadata } from "next";
import { type ReactNode } from "react";

import { Header } from "@/shared/ui/Header";

import s from "./layout.module.scss";

export const metadata: Metadata = {
  title: "Engineer | Главная",
};

export default function CatalogLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className={s.container}>{children}</main>
    </>
  );
}
