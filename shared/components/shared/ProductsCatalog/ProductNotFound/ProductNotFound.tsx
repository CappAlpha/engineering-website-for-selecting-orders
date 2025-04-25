"use client";

import { useRouter } from "next/navigation";
import { type FC } from "react";

import { Button } from "@/components/ui/Button";

import s from "./ProductNotFound.module.scss";

export const ProductNotFound: FC = () => {
  const router = useRouter();

  const onClickRefreshPage = () => {
    router.refresh();
    router.push("/");
  };

  return (
    <div className={s.root}>
      <h5 className={s.notFound}>Товары не найдены</h5>
      <p className={s.description}>
        Попробуйте поменять фильтры или обновите страницу
      </p>
      <Button className={s.refresh} onClick={onClickRefreshPage}>
        Обновить страницу
      </Button>
    </div>
  );
};
