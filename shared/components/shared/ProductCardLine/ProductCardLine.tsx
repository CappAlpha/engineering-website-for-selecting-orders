"use client";

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
  loading: boolean;
  onChangeCount: (type: QuantityActionType) => void;
  onClickRemove: () => void;
}

export const ProductCardLine: FC<Props> = ({
  item,
  loading,
  onChangeCount,
  onClickRemove,
}) => {
  const { name, description, imageUrl, price, quantity } = item;

  return (
    <div className={s.root}>
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
            loading={loading}
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
