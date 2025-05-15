import { type ReactNode } from "react";

import "@/shared/styles/colors.scss";
import "@/shared/styles/global.scss";
import "@/shared/styles/reset.scss";
import { Providers } from "@/shared/ui/Providers";

import s from "./layout.module.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={s.root}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
