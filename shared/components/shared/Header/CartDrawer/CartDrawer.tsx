"use client";

import { Drawer } from "@mui/material";
import cn from "classnames";
import { type FC } from "react";

import { EmptyCartDrawer } from "./EmptyCartDrawer";
import { ListCartDrawer } from "./ListCartDrawer";

import s from "./CartDrawer.module.scss";

export interface Props {
  open: boolean;
  toggleDrawer: (value: boolean) => () => void;
}

export const CartDrawer: FC<Props> = ({ open, toggleDrawer }) => {
  const isEmpty = false;

  const renderDrawerContent = isEmpty ? (
    <EmptyCartDrawer toggleDrawer={toggleDrawer} />
  ) : (
    <ListCartDrawer toggleDrawer={toggleDrawer} />
  );

  return (
    <div className={s.root}>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        anchor="right"
        className={s.drawer}
      >
        <div className={cn(s.wrap, !isEmpty && s.listWrap)}>
          {renderDrawerContent}
        </div>
      </Drawer>
    </div>
  );
};
