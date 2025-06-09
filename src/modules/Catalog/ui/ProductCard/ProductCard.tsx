"use client";

import { Product } from "@prisma/client";
import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import { type FC, type MouseEvent } from "react";

import { useCartQueries } from "@/modules/Cart/hooks/useCartQueries";
import { Button } from "@/shared/ui/Button";
import { Tags } from "@/shared/ui/Tags";

import { Plus } from "../../../../../public/icon";

import s from "./ProductCard.module.scss";

type ProductCardProps = Omit<Product, "createdAt" | "updatedAt">;

interface Props extends ProductCardProps {
  isFirstCategories?: boolean;
}

export const ProductCard: FC<Props> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  tags,
  categorySlug,
  isFirstCategories = false,
}) => {
  const { addToCart, isCartItemAdding } = useCartQueries();

  return (
    <Link
      className={cn(s.root, isCartItemAdding && s.disable)}
      href={`${categorySlug}/${id}`}
    >
      <div className={s.imgWrap}>
        <Image
          className={s.img}
          src={imageUrl}
          alt={name}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill
          loading={isFirstCategories ? "eager" : "lazy"}
          priority={isFirstCategories}
        />
      </div>

      <div className={s.textWrap}>
        <h5 className={s.title}>{name}</h5>
        <p className={s.description}>{description}</p>
      </div>

      <div className={s.bottom}>
        <Tags tags={tags} className={s.tags} />
        <div className={s.bottomWrap}>
          <span className={s.price}>
            от <b>{price} &#8381;</b>
          </span>
          <Button
            onClick={(e: MouseEvent) => addToCart(e, id)}
            loading={isCartItemAdding}
          >
            <Plus className={s.icon} /> Добавить
          </Button>
        </div>
      </div>
    </Link>
  );
};
