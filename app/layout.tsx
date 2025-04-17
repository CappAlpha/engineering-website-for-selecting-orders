import StoreProvider from "./StoreProvider.tsx";
import s from "./layout.module.scss";
import { ReactNode } from "react";
import "@/styles/global.scss";
import "@/styles/colors.scss";
import "@/styles/reset.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={s.root}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
