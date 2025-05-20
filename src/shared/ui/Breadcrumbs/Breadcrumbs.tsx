import { Breadcrumbs as BreadcrumbsMui } from "@mui/material";
import classNames from "classnames";
import Link from "next/link";
import { type FC } from "react";

import s from "./Breadcrumbs.module.scss";

export interface Props {
  name: string;
  pageWrap?: boolean;
}

export const Breadcrumbs: FC<Props> = ({ name, pageWrap = false }) => {
  return (
    <BreadcrumbsMui
      aria-label="breadcrumb"
      className={classNames(s.root, pageWrap && s.wrap)}
    >
      <Link href="/">Главная</Link>
      <span aria-current="page">{name}</span>
    </BreadcrumbsMui>
  );
};
