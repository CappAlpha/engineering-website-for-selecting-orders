"use client";

import { Drawer } from "@mui/material";
import cn from "classnames";
import { type FC } from "react";

import { EmptyCartDrawer } from "./EmptyCartDrawer";
import { ListCartDrawer } from "./ListCartDrawer";

import s from "./CartDrawer.module.scss";

interface Props {
  open: boolean;
  isCartEmpty: boolean;
  toggleDrawer: (value: boolean) => () => void;
}

export const CartDrawer: FC<Props> = ({ open, isCartEmpty, toggleDrawer }) => {
  return (
    <Drawer
      open={open}
      onClose={toggleDrawer(false)}
      anchor="right"
      className={s.drawer}
    >
      <div className={cn(s.wrap, !isCartEmpty && s.noJustify)}>
        {isCartEmpty ? (
          <EmptyCartDrawer onClose={toggleDrawer(false)} />
        ) : (
          <ListCartDrawer onClose={toggleDrawer(false)} />
        )}
      </div>
    </Drawer>
  );
};
