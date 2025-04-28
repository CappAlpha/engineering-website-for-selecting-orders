"use client";

import { Category } from "@prisma/client";
import cn from "classnames";
import { useState, type FC } from "react";

import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { useAppSelector } from "@/hook/useAppSelector";

import { AngleDown } from "../../../../public/icon";
import { SortDropdown } from "../SortDropdown";

import s from "./TopBar.module.scss";

export interface TopBarProps {
  categories: Pick<Category, "id" | "name">[];
}

export const TopBar: FC<TopBarProps> = ({ categories }) => {
  const activeId = useAppSelector((state) => state.categories.activeId);
  const loadingFetch = useAppSelector((state) => state.cart.loadingFetch);
  const [isBarHidden, setIsBarHidden] = useState(false);

  const isHideBtn = loadingFetch || activeId === categories[0].name;
  const isBarVisibleAtTop = !isHideBtn && isBarHidden;

  const toggleBarVisibility = () => setIsBarHidden((prev) => !prev);

  const handleScroll = (name: string, isActive: boolean) => {
    if (!isActive) {
      const element = document.getElementById(name);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // console.log(activeId)

  return (
    <div className={cn(s.root, isBarVisibleAtTop && s.hidden)}>
      <div className={s.wrap}>
        {categories.length > 0 ? (
          <Tabs
            items={categories}
            activeId={activeId}
            onClick={handleScroll}
            loading={loadingFetch}
          />
        ) : null}
        <SortDropdown />
      </div>

      {categories.length > 1 && (
        <>
          <Button
            className={cn(
              s.showBtn,
              (isHideBtn || !isBarHidden) && s.hiddenBtn,
            )}
            onClick={toggleBarVisibility}
            aria-label="Показать топ бар"
          >
            <AngleDown />
          </Button>

          <Button
            className={cn(s.hideBtn, (isHideBtn || isBarHidden) && s.hiddenBtn)}
            onClick={toggleBarVisibility}
            aria-label="Скрыть топ бар"
          >
            <AngleDown />
          </Button>
        </>
      )}
    </div>
  );
};
