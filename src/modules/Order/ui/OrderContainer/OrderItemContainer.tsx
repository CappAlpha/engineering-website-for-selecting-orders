import cn from "classnames";
import { type ReactNode, type FC } from "react";

import { Button } from "@/shared/ui/Button";

import { Trash } from "../../../../../public/icon";

import s from "./OrderItemContainer.module.scss";

export interface Props {
  title: string;
  children: ReactNode;
  isCart?: boolean;
}

export const OrderItemContainer: FC<Props> = ({
  title,
  children,
  isCart = false,
}) => {
  return (
    <section className={s.root}>
      <div className={cn(s.header, isCart && s.headerCart)}>
        <h2 className={s.title}>{title}</h2>
        {isCart && (
          <Button color="transparent" className={s.btn}>
            <Trash className={s.icon} /> Очистить корзину
          </Button>
        )}
      </div>
      {children}
    </section>
  );
};
