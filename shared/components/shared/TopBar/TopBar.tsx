"use client";

import { Category } from "@prisma/client";
import cn from "classnames";
import { useEffect, useState, type FC } from "react";

import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { useAppSelector } from "@/hook/useAppSelector";

import { AngleDown } from "../../../../public/icon";
import { SortDropdown } from "../SortDropdown";

import s from "./TopBar.module.scss";

export interface Props {
  categories: Category[];
}

export const TopBar: FC<Props> = ({ categories }) => {
  const activeIndex = useAppSelector((state) => state.categories.activeId);
  const [isBarHidden, setIsBarHidden] = useState(false);
  const [isBtnHidden, setIsBtnHidden] = useState(true);

  const OnClickChangeVisible = () => setIsBarHidden((prev) => !prev);

  useEffect(() => {
    if (activeIndex > 1) {
      setIsBtnHidden(false);
    } else {
      setIsBtnHidden(true);
    }
  }, [activeIndex]);

  const handleScroll = (name: string, isActive: boolean) => {
    if (!isActive) {
      const element = document.getElementById(name);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const isBarVisible = !isBtnHidden && isBarHidden;

  return (
    <div className={cn(s.root, isBarVisible && s.hidden)}>
      <div className={s.wrap}>
        {/* TODO: remove later mb */}
        {categories.length !== 0 ? (
          <Tabs
            items={categories}
            activeIndex={activeIndex}
            onClick={handleScroll}
          />
        ) : (
          <div />
        )}
        <SortDropdown />
      </div>
      <Button
        className={cn(s.showBtn, (isBtnHidden || !isBarHidden) && s.hiddenBtn)}
        onClick={OnClickChangeVisible}
      >
        <AngleDown />
      </Button>
      <Button
        className={cn(s.hideBtn, (isBtnHidden || isBarHidden) && s.hiddenBtn)}
        onClick={OnClickChangeVisible}
      >
        <AngleDown />
      </Button>
    </div>
  );
};
