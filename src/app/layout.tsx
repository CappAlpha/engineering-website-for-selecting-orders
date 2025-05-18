import { Geist, Geist_Mono } from "next/font/google";
import { type ReactNode } from "react";

import "@/shared/styles/colors.scss";
import "@/shared/styles/global.scss";
import "@/shared/styles/reset.scss";

import { Providers } from "./Providers";

import s from "./layout.module.scss";

const geist = Geist({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru" className={geist.variable + " " + geistMono.variable}>
      <body className={s.root}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
