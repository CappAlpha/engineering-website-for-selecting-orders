"use client";

import { Product } from "@prisma/client";
import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import { type MouseEvent, type FC } from "react";

import { selectIsItemAdding } from "@/modules/Cart/store/cartSelectors";
import { pageConfig } from "@/shared/constants/pages";
import { useAppSelector } from "@/shared/hook/useAppSelector";
import { Button } from "@/shared/ui/Button";
import { Tags } from "@/shared/ui/Tags";

import { Plus } from "../../../../../public/icon";

import s from "./ProductCard.module.scss";

type ProductCardProps = Omit<Product, "categoryId" | "createdAt" | "updatedAt">;

interface Props extends ProductCardProps {
  onClickButton: (e: MouseEvent) => Promise<void>;
  isLazy?: boolean;
}

export const ProductCard: FC<Props> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  tags,
  isLazy = false,
  onClickButton,
}) => {
  const isAdding = useAppSelector(selectIsItemAdding(id));
  return (
    <Link
      className={cn(s.root, isAdding && s.disable)}
      href={`${pageConfig.PRODUCT}${id}`}
    >
      <div className={s.imgWrap}>
        <Image
          className={s.img}
          src={imageUrl}
          alt={name}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill
          loading={isLazy ? "lazy" : "eager"}
        />
      </div>

      <div className={s.textWrap}>
        <h5 className={s.title}>{name}</h5>
        <p className={s.description}>{description}</p>
      </div>

      <div className={s.bottom}>
        <Tags tags={tags} />
        <div className={s.bottomWrap}>
          <span className={s.price}>
            от <b>{price} &#8381;</b>
          </span>
          <Button onClick={onClickButton} loading={isAdding}>
            <Plus className={s.icon} /> Добавить
          </Button>
        </div>
      </div>
    </Link>
  );
};
