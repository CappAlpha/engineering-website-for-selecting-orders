import { type ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import "@/shared/styles/colors.scss";
import "@/shared/styles/global.scss";
import "@/shared/styles/reset.scss";

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
        <StoreProvider>
          {children}
          <Toaster
            toastOptions={{
              style: {
                background: "#454545",
                color: "#fff",
              },
            }}
          />
        </StoreProvider>
      </body>
    </html>
  );
}
