import { Drawer } from "@mui/material";
import cn from "classnames";
import { type FC } from "react";

import { EmptyCartDrawer } from "./EmptyCartDrawer";
import { ListCardDrawerProps, ListCartDrawer } from "./ListCartDrawer";

import s from "./CartDrawer.module.scss";

interface Props extends ListCardDrawerProps {
  open: boolean;
  loadingRemoveId: number | null;
  isEmpty: boolean;
  toggleDrawer: (value: boolean) => () => void;
}

export const CartDrawer: FC<Props> = ({
  items,
  totalAmount,
  loadingUpdateProductId,
  loadingRemoveId,
  loadingUpdate,
  errorUpdate,
  loadingRemove,
  errorRemove,
  open,
  isEmpty,
  toggleDrawer,
  handleQuantityChange,
  handleRemove,
}) => {
  return (
    <div className={s.root}>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        anchor="right"
        className={s.drawer}
      >
        <div className={cn(s.wrap, !isEmpty && s.noJustify)}>
          {" "}
          {isEmpty ? (
            <EmptyCartDrawer onClose={toggleDrawer(false)} />
          ) : (
            <ListCartDrawer
              items={items}
              totalAmount={totalAmount}
              loadingUpdateProductId={loadingUpdateProductId}
              loadingRemoveId={loadingRemoveId}
              loadingUpdate={loadingUpdate}
              errorUpdate={errorUpdate}
              loadingRemove={loadingRemove}
              errorRemove={errorRemove}
              onClose={toggleDrawer(false)}
              handleQuantityChange={handleQuantityChange}
              handleRemove={handleRemove}
            />
          )}
        </div>
      </Drawer>
    </div>
  );
};
