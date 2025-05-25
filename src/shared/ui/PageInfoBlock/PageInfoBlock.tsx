"use client";

import { ReactNode, type FC } from "react";

import { Arrow } from "../../../../public/icon";
import { Button } from "../Button";

import s from "./PageInfoBlock.module.scss";

interface Props {
  title: string;
  description: string;
  icon: ReactNode;
}

export const PageInfoBlock: FC<Props> = ({ title, description, icon }) => {
  const onClickRefresh = () => {
    window.location.reload();
    window.localStorage.clear();
  };

  return (
    <div className={s.root}>
      <div className={s.left}>
        <h1 className={s.title}>{title}</h1>
        <p className={s.description}>{description}</p>
        <div className={s.btns}>
          <Button href="/" className={s.btn}>
            <Arrow className={s.icon} />
            На главную
          </Button>
          <Button onClick={onClickRefresh} className={s.btn} color="outline">
            Обновить
          </Button>
        </div>
      </div>
      <div className={s.right}>{icon}</div>
    </div>
  );
};
