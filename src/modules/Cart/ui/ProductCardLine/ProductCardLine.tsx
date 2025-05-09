"use client";

import cn from "classnames";
import Image from "next/image";
import { type FC } from "react";

import { CartStateItem } from "@/entities/cart";
import { CountBtns } from "@/modules/Cart/ui/CountBtns";
import {
  QuantityActionType,
  CART_QUANTITY_LIMITS,
} from "@/shared/constants/cart";
import { useAppSelector } from "@/shared/hook/useAppSelector";
import { Button } from "@/shared/ui/Button";

import { Trash } from "../../../../../public/icon";
import {
  selectIsItemRemoving,
  selectIsItemUpdating,
} from "../../store/cartSelectors";

import s from "./ProductCardLine.module.scss";

interface Props {
  item: CartStateItem;
  onChangeCount: (type: QuantityActionType) => void;
  onClickRemove: () => void;
}

export const ProductCardLine: FC<Props> = ({
  item,
  onChangeCount,
  onClickRemove,
}) => {
  const { id, name, description, imageUrl, price, quantity } = item;
  const isUpdating = useAppSelector(selectIsItemUpdating(id));
  const isRemoving = useAppSelector(selectIsItemRemoving(id));

  return (
    <div className={cn(s.root, isRemoving && s.remove)}>
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
            loading={isUpdating}
          />
          <div className={s.bottomRight}>
            <p className={s.price}>{price} &#8381;</p>
            <Button
              onClick={onClickRemove}
              disabled={isRemoving}
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
