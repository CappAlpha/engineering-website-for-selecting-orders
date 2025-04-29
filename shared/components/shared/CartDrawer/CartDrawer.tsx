"use client";

import { Drawer } from "@mui/material";
import { ReactElement, type FC } from "react";

import s from "./CartDrawer.module.scss";

interface Props {
  children: ReactElement;
  open: boolean;
  toggleDrawer: (value: boolean) => () => void;
}

export const CartDrawer: FC<Props> = ({ open, toggleDrawer, children }) => {
  return (
    <div className={s.root}>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        anchor="right"
        className={s.drawer}
      >
        <div className={s.wrap}>{children}</div>
      </Drawer>
    </div>
  );
};
