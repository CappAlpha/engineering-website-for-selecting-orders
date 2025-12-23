"use client";

import type { Product } from "@prisma/client";
import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import { memo, useCallback, type HTMLAttributes, type MouseEvent } from "react";
import toast from "react-hot-toast";

import { deleteProduct } from "@/app/actions";

import { Trash } from "../../../../../public/icon";
import { Button } from "../../Button";

import s from "./SearchOption.module.scss";

type Props = HTMLAttributes<HTMLLIElement> & {
  option: Product;
  isAdmin?: boolean;
};

export const SearchOption = memo(function SearchOption({
  option,
  isAdmin,
  className,
  ...liProps
}: Props) {
  const onClickDeleteProduct = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      await toast.promise(deleteProduct(option.id), {
        loading: "Удаляем...",
        success: "Товар удалён из базы!",
        error: (err: unknown) =>
          err instanceof Error ? err.message : "Не удалось удалить товар",
      });
      // TODO: add update to list after delete
    },
    [option.id],
  );

  return (
    <li {...liProps} className={cn(s.root, className)}>
      <Link href={`/${option.categorySlug}/${option.id}`} className={s.link}>
        <Image
          className={s.img}
          width={40}
          height={40}
          src={option.imageUrl}
          alt={option.name}
          loading="lazy"
        />
        <span className={s.name}>{option.name}</span>
        <span className={cn(s.price, isAdmin && s.priceAdmin)}>
          {option.price} ₽
        </span>
      </Link>

      {isAdmin && (
        <Button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={onClickDeleteProduct}
          color="transparent"
          className={s.btn}
        >
          <Trash className={s.icon} />
        </Button>
      )}
    </li>
  );
});
