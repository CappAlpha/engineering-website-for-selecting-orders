import { Header } from "@/components/shared/Header";

import "@/styles/reset.scss";
import "@/styles/global.scss";
import "@/styles/colors.scss";
import s from "./layout.module.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={s.root}>
        <Header />
        <main className={s.container}>{children}</main>
      </body>
    </html>
  );
}
