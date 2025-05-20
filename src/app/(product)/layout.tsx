import { type ReactNode } from "react";

import { Footer } from "@/shared/ui/Footer";
import { Header } from "@/shared/ui/Header";

import s from "./layout.module.scss";

export default function CatalogLayout({
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
