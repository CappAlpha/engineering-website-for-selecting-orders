"use client";

import cn from "classnames";
import Image from "next/image";
import { type FC } from "react";

import { CartStateItem } from "@/entities/cart";
import { CountBtns } from "@/features/Cart/ui/CountBtns";
import {
  QuantityActionType,
  CART_QUANTITY_LIMITS,
} from "@/shared/constants/cart";
import { Button } from "@/shared/ui/Button";

import { Trash } from "../../../../../public/icon";

import s from "./ProductCardLine.module.scss";

interface Props {
  item: CartStateItem;
  loadingUpdate: boolean;
  errorUpdate: string | null;
  loadingRemove: boolean;
  errorRemove: string | null;
  onChangeCount: (type: QuantityActionType) => void;
  onClickRemove: () => void;
}

export const ProductCardLine: FC<Props> = ({
  item,
  loadingUpdate,
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
            loading={loadingUpdate}
          />
          <div className={s.bottomRight}>
            <p className={s.price}>{price} &#8381;</p>
            <Button
              onClick={onClickRemove}
              disabled={loadingRemove}
              color="transparent"
              noPadding
            >
              <Trash className={s.trash} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
