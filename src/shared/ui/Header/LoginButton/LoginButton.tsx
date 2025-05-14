"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, type FC } from "react";
import toast from "react-hot-toast";

import { User } from "../../../../../public/icon";
import { Button } from "../../Button";

import s from "./LoginButton.module.scss";

export const LoginButton: FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.has("paid")) {
      toast.success("Заказ успешно оплачен! Информация отправлена на почту!");

      // TODO: вести на страницу заказов?
      router.push("/", { scroll: false });
    }
  }, []);

  return (
    <div className={s.root}>
      <Button>
        <User className={s.icon} /> Войти
      </Button>
    </div>
  );
};
