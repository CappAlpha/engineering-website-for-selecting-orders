import { Button } from "@/components/ui/Button";
import { Plus } from "../../../../public/icon";
import s from "./ProductCard.module.scss";
import { type FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tags } from "../Tags";
import { Product } from "@prisma/client";

type ProductCardProps = Pick<
  Product,
  "id" | "name" | "description" | "price" | "imageUrl" | "tags"
>;

export const ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  tags,
}) => {
  return (
    <Link className={s.root} href={`/product/${id}`}>
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

      <Tags tags={tags} />

      <div className={s.bottom}>
        <span className={s.price}>
          от <b>{price} ₽</b>
        </span>
        <Button>
          <Plus /> Добавить
        </Button>
      </div>
    </Link>
  );
};
