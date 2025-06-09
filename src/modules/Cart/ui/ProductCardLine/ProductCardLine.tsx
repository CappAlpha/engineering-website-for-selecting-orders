"use client";

import cn from "classnames";
import Image from "next/image";
import { type FC } from "react";

import { CartQuantityLimits } from "@/modules/Cart/constants/cart";
import { CartStateItem } from "@/modules/Cart/entities/cart";
import { CountBtns } from "@/modules/Cart/ui/CountBtns";
import { Button } from "@/shared/ui/Button";

import { Trash } from "../../../../../public/icon";
import { useCartQueries } from "../../hooks/useCartQueries";

import s from "./ProductCardLine.module.scss";

interface Props {
  item: CartStateItem;
}

export const ProductCardLine: FC<Props> = ({ item }) => {
  const { name, description, imageUrl, price, quantity } = item;
  const { handleQuantityChange, isCartUpdating, handleRemove, isCartRemoving } =
    useCartQueries();

  return (
    <div className={cn(s.root, isCartRemoving && s.remove)}>
      <div className={s.imgWrap}>
        <Image src={imageUrl} alt={name} fill className={s.img} />
      </div>

      <div className={s.contentWrap}>
        <h5 className={s.title}>{name}</h5>
        <p className={s.description}>{description}</p>
        <div className={s.bottom}>
          <CountBtns
            onChangeCount={(type) =>
              handleQuantityChange(item.id, item.quantity, type)
            }
            value={quantity}
            minValue={CartQuantityLimits.MIN}
            maxValue={CartQuantityLimits.MAX}
            loading={isCartUpdating}
          />
          <div className={s.bottomRight}>
            <p className={cn(s.price, isCartUpdating && s.loading)}>
              {price} &#8381;
            </p>
            <Button
              onClick={() => handleRemove(item.id)}
              disabled={isCartRemoving}
              color="transparent"
              noPadding
              className={s.btn}
            >
              <Trash className={s.trash} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
