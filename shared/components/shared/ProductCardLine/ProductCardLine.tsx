"use client";

import { Product } from "@prisma/client";
import Image from "next/image";
import { type FC } from "react";

import { Button } from "@/components/ui/Button";
import { noop } from "@/utils/noop";

import { Trash } from "../../../../public/icon";
import { CountBtns } from "../CountBtns";

import s from "./ProductCardLine.module.scss";

type ProductCardLineType = Pick<
  Product,
  "name" | "description" | "imageUrl" | "price"
>;

interface ProductCardLineProps {
  card: ProductCardLineType;
}

export const ProductCardLine: FC<ProductCardLineProps> = ({ card }) => {
  const { name, description, imageUrl, price } = card;

  return (
    <div className={s.root}>
      <div className={s.imgWrap}>
        <Image src={imageUrl} alt={name} fill className={s.img} />
      </div>

      <div className={s.contentWrap}>
        <h5 className={s.title}>{name}</h5>
        <p className={s.description}>{description}</p>
        <div className={s.bottom}>
          <CountBtns onClick={noop} />
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
