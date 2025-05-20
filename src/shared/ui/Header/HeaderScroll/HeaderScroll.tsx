"use client";

import cn from "classnames";
import { useEffect, useState, ReactNode, FC } from "react";

import s from "../Header.module.scss";

interface Props {
  children: ReactNode;
  isCatalogPage: boolean;
}

export const HeaderScroll: FC<Props> = ({ children, isCatalogPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!isCatalogPage) {
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isCatalogPage]);

  return (
    <div className={cn(isCatalogPage && isScrolled && s.scrolled)}>
      {children}
    </div>
  );
};
