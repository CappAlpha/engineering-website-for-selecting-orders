"use client";

import { Category } from "@prisma/client";
import { type FC } from "react";

import { useAppSelector } from "@/shared/hook/useAppSelector";
import { Tabs } from "@/shared/ui/Tabs";

import s from "./TopBar.module.scss";

export interface TopBarProps {
  categories: Pick<Category, "id" | "name">[];
}

export const TopBar: FC<TopBarProps> = ({ categories }) => {
  const activeId = useAppSelector((state) => state.categories.activeId);

  const handleScroll = (name: string, isActive: boolean) => {
    if (!isActive) {
      const element = document.getElementById(name);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className={s.root}>
      <div className={s.wrap}>
        {categories.length > 0 ? (
          <Tabs items={categories} activeId={activeId} onClick={handleScroll} />
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};
