import { Breadcrumbs as BreadcrumbsMui } from "@mui/material";
import classNames from "classnames";
import Link from "next/link";
import { type FC } from "react";

import s from "./Breadcrumbs.module.scss";

interface Props {
  name: string[];
  url: string[];
  pageWrap?: boolean;
}

export const Breadcrumbs: FC<Props> = ({ name, url, pageWrap = false }) => {
  return (
    <BreadcrumbsMui
      aria-label="breadcrumb"
      className={classNames(s.root, pageWrap && s.wrap)}
    >
      <Link href="/">Главная</Link>
      {name.map((item, index) =>
        name.length - 1 === index ? (
          <span key={item}>{item}</span>
        ) : (
          <Link key={item} href={`/${url[index]}`}>
            {item}
          </Link>
        ),
      )}
    </BreadcrumbsMui>
  );
};
