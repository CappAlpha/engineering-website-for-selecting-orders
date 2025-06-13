"use client";

import { Category } from "@prisma/client";
import { type FC } from "react";

import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { Tabs } from "@/shared/ui/Tabs";

import s from "./TopBar.module.scss";

export interface TopBarProps {
  categories: Pick<Category, "id" | "name">[];
}

export const TopBar: FC<TopBarProps> = ({ categories }) => {
  const activeId = useAppSelector((state) => state.categories.activeId);
  const changed = useAppSelector((state) => state.filters.changed);

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
      {categories.length > 0 ? (
        <Tabs
          items={categories}
          activeId={activeId}
          onClick={handleScroll}
          loading={changed}
        />
      ) : (
        <div />
      )}
    </div>
  );
};
