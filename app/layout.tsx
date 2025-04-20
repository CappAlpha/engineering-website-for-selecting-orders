import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ReactNode } from "react";

import "@/styles/colors.scss";
import "@/styles/global.scss";
import "@/styles/reset.scss";

import StoreProvider from "./StoreProvider.tsx";

import s from "./layout.module.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={s.root}>
        <AppRouterCacheProvider>
          <StoreProvider>{children}</StoreProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
