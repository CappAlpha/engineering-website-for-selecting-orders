import { Header } from "@/components/shared/Header";
import s from "./layout.module.scss";
import { ReactNode } from "react";
import { Metadata } from "next";

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
