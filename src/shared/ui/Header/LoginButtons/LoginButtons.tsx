"use client";

import { useSession } from "next-auth/react";
import { type FC } from "react";

import { pageConfig } from "@/shared/constants/pages";

import { User } from "../../../../../public/icon";
import { Button } from "../../Button";

import s from "./LoginButtons.module.scss";

interface Props {
  onClickOpen: VoidFunction;
}

export const LoginButtons: FC<Props> = ({ onClickOpen }) => {
  const { data: session } = useSession();

  return (
    <>
      {!session ? (
        <Button onClick={onClickOpen} className={s.root}>
          <User className={s.icon} /> Войти
        </Button>
      ) : (
        <Button href={pageConfig.PROFILE} className={s.root}>
          <User className={s.icon} /> Профиль
        </Button>
      )}
    </>
  );
};
