import { Button } from "@/components/ui/Button";
import { Plus } from "../../../../public/icon";
import s from "./ProductCard.module.scss";
import { type FC } from "react";
import Image from "next/image";
import Link from "next/link";

export interface Props {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export const ProductCard: FC<Props> = ({
  id,
  name,
  description,
  price,
  imageUrl,
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
