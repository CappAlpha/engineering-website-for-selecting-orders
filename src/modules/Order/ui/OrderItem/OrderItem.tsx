import cn from "classnames";
import { type ReactNode, type FC } from "react";

import { Button } from "@/shared/ui/Button";

import { Trash } from "../../../../../public/icon";

import s from "./OrderItem.module.scss";

export interface Props {
  title: string;
  children: ReactNode;
  loading?: boolean;
  isCart?: boolean;
  handleClearAll?: () => void;
}

export const OrderItem: FC<Props> = ({
  title,
  children,
  loading = false,
  isCart = false,
  handleClearAll,
}) => {
  return (
    <section className={s.root}>
      <div className={cn(s.header, isCart && s.headerCart)}>
        <h2 className={s.title}>{title}</h2>
        {isCart && (
          <Button
            onClick={handleClearAll}
            color="transparent"
            className={s.btn}
            loading={loading}
          >
            {!loading && <Trash className={s.icon} />} Очистить корзину
          </Button>
        )}
      </div>
      {children}
    </section>
  );
};
