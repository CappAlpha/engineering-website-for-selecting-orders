"use client";

import cn from "classnames";
import Image from "next/image";
import { type FC } from "react";

import { Button } from "@/components/ui/Button";
import { QuantityActionType } from "@/constants/cart";
import { CartStateItem } from "@/entities/cart";
import { CART_QUANTITY_LIMITS } from "@/hook/useCart";

import { Trash } from "../../../../public/icon";
import { CountBtns } from "../CountBtns";

import s from "./ProductCardLine.module.scss";

interface Props {
  item: CartStateItem;
  errorUpdate: string | null;
  loadingRemove: boolean;
  errorRemove: string | null;
  onChangeCount: (type: QuantityActionType) => void;
  onClickRemove: () => void;
}

export const ProductCardLine: FC<Props> = ({
  item,
  loadingRemove,
  onChangeCount,
  onClickRemove,
}) => {
  const { name, description, imageUrl, price, quantity } = item;

  return (
    <div className={cn(s.root, loadingRemove && s.remove)}>
      <div className={s.imgWrap}>
        <Image src={imageUrl} alt={name} fill className={s.img} />
      </div>

      <div className={s.contentWrap}>
        <h5 className={s.title}>{name}</h5>
        <p className={s.description}>{description}</p>
        <div className={s.bottom}>
          <CountBtns
            onChangeCount={onChangeCount}
            value={quantity}
            minValue={CART_QUANTITY_LIMITS.MIN}
            maxValue={CART_QUANTITY_LIMITS.MAX}
          />
          <div className={s.bottomRight}>
            <p className={s.price}>{price} &#8381;</p>
            <Button onClick={onClickRemove} color="transparent" noPadding>
              <Trash className={s.trash} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
