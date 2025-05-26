"use client";

import cn from "classnames";
import { FC, ReactNode, useEffect, useState } from "react";

import s from "../Header.module.scss";

interface Props {
  children: ReactNode;
}

export const HeaderScroll: FC<Props> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Check scroll position immediately on component mount
    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const className = cn(isScrolled && s.scrolled);

  return <div className={className}>{children}</div>;
};
