import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";

import { Button } from "@/components/ui/Button";
import { pageConfig } from "@/constants/pages";
import { useCart } from "@/hook/useCart";

import { Plus } from "../../../../public/icon";
import { Tags } from "../../ui/Tags";

import s from "./ProductCard.module.scss";

type ProductCardProps = Omit<Product, "categoryId" | "createdAt" | "updatedAt">;

export const ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  tags,
}) => {
  const { loadingFetch, loadingAdd, errorFetch, errorAdd, addToCart } =
    useCart();

  const isLoading = loadingFetch || loadingAdd;
  const isError = errorFetch ?? errorAdd;

  return (
    <Link
      className={s.root}
      href={isLoading ? "" : `${pageConfig.PRODUCT}${id}`}
    >
      <div className={s.imgWrap}>
        <Image
          className={s.img}
          src={imageUrl}
          alt={name}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill
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
          {!isError && (
            <Button onClick={(e) => addToCart(e, id)} loading={isLoading}>
              <Plus className={s.icon} /> Добавить
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
};
