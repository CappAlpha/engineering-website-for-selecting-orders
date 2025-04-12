"use client";
import { useEffect, useState, type FC } from "react";
import cn from "classnames";

import { Tabs } from "@/components/ui/Tabs";
import { SortDropdown } from "../SortDropdown";
import { useAppSelector } from "@/hook/useAppSelector";
import { Button } from "@/components/ui/Button";

import s from "./TopBar.module.scss";
import { AngleDown } from "../../../../public/icon";

export interface Props {
  //
}

const ORDERS = ["Чертежи", "БЭМ", "Геология"];

export const TopBar: FC<Props> = ({}) => {
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

  const isBarVisible = !isBtnHidden && isBarHidden;

  return (
    <div className={cn(s.root, isBarVisible && s.hidden)}>
      <div className={s.wrap}>
        <Tabs items={ORDERS} activeIndex={activeIndex} />
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
