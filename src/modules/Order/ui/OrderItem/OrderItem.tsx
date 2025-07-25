import cn from "classnames";
import { type FC, type ReactNode } from "react";

import { Button } from "@/shared/ui/Button";

import { Trash } from "../../../../../public/icon";

import s from "./OrderItem.module.scss";

interface Props {
  title: string;
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  isCartEmpty?: boolean;
  handleClearCart?: VoidFunction;
}

export const OrderItem: FC<Props> = ({
  title,
  children,
  loading = false,
  disabled = false,
  isCartEmpty = false,
  handleClearCart,
}) => {
  return (
    <section className={cn(s.root, disabled && s.disabled)}>
      <div className={cn(s.header, isCartEmpty && s.headerCart)}>
        <h2 className={s.title}>{title}</h2>
        {isCartEmpty && (
          <Button
            onClick={handleClearCart}
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
