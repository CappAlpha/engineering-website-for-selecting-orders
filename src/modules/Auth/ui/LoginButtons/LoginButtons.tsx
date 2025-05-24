"use client";

import { useSession } from "next-auth/react";
import { type FC } from "react";

import { PageConfig } from "@/shared/constants/pages";
import { Button } from "@/shared/ui/Button";

import { User } from "../../../../../public/icon";

import s from "./LoginButtons.module.scss";

interface Props {
  onClickOpen: VoidFunction;
}

export const LoginButtons: FC<Props> = ({ onClickOpen }) => {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  return (
    <>
      {isLoading ? (
        <Button className={s.root} loading>
          <User className={s.icon} /> Войти
        </Button>
      ) : !isAuthenticated ? (
        <Button onClick={onClickOpen} className={s.root}>
          <User className={s.icon} /> Войти
        </Button>
      ) : (
        <Button href={PageConfig.PROFILE} className={s.root}>
          <User className={s.icon} /> Профиль
        </Button>
      )}
    </>
  );
};
