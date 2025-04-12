import { Header } from "@/components/shared/Header";
import StoreProvider from "./StoreProvider.tsx";
import s from "./layout.module.scss";
import "@/styles/global.scss";
import "@/styles/colors.scss";
import "@/styles/reset.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={s.root}>
        <StoreProvider>
          <Header />
          <main className={s.container}>{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
