import { Metadata } from "next";
import { type ReactNode } from "react";

import { Footer } from "@/shared/ui/Footer";
import { Header } from "@/shared/ui/Header";

import s from "./layout.module.scss";

export const metadata: Metadata = {
  title: {
    template: "%s | Engineer",
    default: "Главная | Engineer",
  },
  description: "Инженерные решения и продукты высокого качества",
  applicationName: "Engineer",
  metadataBase: new URL(process.env.DOMAIN ?? ""),
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function CatalogLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Header isCatalogPage />
      <main className={s.container}>{children}</main>
      <Footer isCatalogPage />
    </>
  );
}
