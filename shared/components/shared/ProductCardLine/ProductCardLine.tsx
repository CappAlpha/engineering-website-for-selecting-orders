"use client";

import Image from "next/image";
import { type FC } from "react";

import { Button } from "@/components/ui/Button";
import { CartStateItem } from "@/entities/cart";
import { noop } from "@/utils/noop";

import { Trash } from "../../../../public/icon";
import { CountBtns } from "../CountBtns";

import s from "./ProductCardLine.module.scss";

interface Props {
  item: CartStateItem;
}

export const ProductCardLine: FC<Props> = ({ item }) => {
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
          <CountBtns onClick={noop} value={quantity} />
          <div className={s.bottomRight}>
            <p className={s.price}>{price} &#8381;</p>
            <Button onClick={noop} color="transparent" noPadding>
              <Trash className={s.trash} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
