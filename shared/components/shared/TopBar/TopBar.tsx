"use client";
import { useAppSelector } from "@/hook/useAppSelector";
import { useEffect, useState, type FC } from "react";
import { AngleDown } from "../../../../public/icon";
import { Button } from "@/components/ui/Button";
import { SortDropdown } from "../SortDropdown";
import { Tabs } from "@/components/ui/Tabs";
import { Category } from "@prisma/client";
import s from "./TopBar.module.scss";
import cn from "classnames";

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
        <Tabs items={categories} activeIndex={activeIndex} onClick={handleScroll} />
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
