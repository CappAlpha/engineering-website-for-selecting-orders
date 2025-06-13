"use client";

import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { HTMLAttributes, Key, MouseEvent } from "react";
import toast from "react-hot-toast";

import { deleteProduct } from "@/app/actions";

import { Trash } from "../../../../../public/icon";
import { Button } from "../../Button";

import s from "./SearchOption.module.scss";

interface AutocompleteOptionProps extends HTMLAttributes<HTMLLIElement> {
  key: Key;
  isAdmin?: boolean;
}

export const SearchOption = (
  props: AutocompleteOptionProps,
  option: Product,
) => {
  const { key, isAdmin, ...otherProps } = props;

  const onClickDeleteProduct = async (e: MouseEvent, id: string) => {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();

    await toast.promise(deleteProduct(id), {
      loading: "Удаляем...",
      success: "Товар удалён из базы!",
      error: (error) => error.message,
    });
  };

  return (
    <li key={key + option.id} {...otherProps} className={s.root}>
      <Link href={`/${option.categorySlug}/${option.id}`} className={s.link}>
        <Image
          className={s.img}
          width={39}
          height={39}
          src={option.imageUrl}
          alt={option.name}
          loading="lazy"
        />
        <span className={s.name}>{option.name}</span>
        <span className={s.price}>{option.price} ₽</span>
        {isAdmin && (
          <Button
            onClick={(e: MouseEvent) => onClickDeleteProduct(e, option.id)}
            color="transparent"
            className={s.btn}
          >
            <Trash className={s.icon} />
          </Button>
        )}
      </Link>
    </li>
  );
};
