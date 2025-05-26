import { Breadcrumbs as BreadcrumbsMui } from "@mui/material";
import classNames from "classnames";
import Link from "next/link";
import { type FC } from "react";

import s from "./Breadcrumbs.module.scss";

interface Props {
  items: Array<{
    name: string;
    url: string;
  }>;
  pageWrap?: boolean;
}

export const Breadcrumbs: FC<Props> = ({ items, pageWrap = false }) => {
  return (
    <BreadcrumbsMui
      aria-label="breadcrumb"
      className={classNames(s.root, pageWrap && s.wrap)}
    >
      <Link href="/">Главная</Link>
      {items.map(({ name, url }, index) =>
        items.length - 1 === index ? (
          <span key={name}>{name}</span>
        ) : (
          <Link key={name} href={`/${url}`}>
            {name}
          </Link>
        ),
      )}
    </BreadcrumbsMui>
  );
};
