import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { HTMLAttributes, Key } from "react";

import s from "./SearchOption.module.scss";

interface AutocompleteOptionProps extends HTMLAttributes<HTMLLIElement> {
  key: Key;
}

export const SearchOption = (
  props: AutocompleteOptionProps,
  option: Product,
) => {
  const { key, ...otherProps } = props;
  return (
    <li key={key} {...otherProps} className={s.root}>
      <Link href={`/${option.categorySlug}/${option.id}`} className={s.link}>
        <Image
          className={s.img}
          width={39}
          height={39}
          src={option.imageUrl}
          alt={option.name}
          loading="lazy"
        />
        <span>{option.name}</span>
      </Link>
    </li>
  );
};
