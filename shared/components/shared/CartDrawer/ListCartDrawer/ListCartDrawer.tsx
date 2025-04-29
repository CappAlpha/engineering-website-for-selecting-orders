import { type FC } from "react";

import { ProductCardLine } from "@/components/shared/ProductCardLine";
import { Button } from "@/components/ui/Button";
import { QuantityActionType } from "@/constants/cart";
import { CartState } from "@/store/cart/cartSlice";
import { pluralize } from "@/utils/pluralize";

import { Arrow, Plus } from "../../../../../public/icon";

import s from "./ListCartDrawer.module.scss";

export interface ListCardDrawerProps
  extends Omit<
    CartState,
    | "loadingAddProductId"
    | "loadingFetch"
    | "loadingAdd"
    | "errorFetch"
    | "errorAdd"
  > {
  loadingUpdateProductId: number | null;
  loadingRemoveId: number | null;
  handleQuantityChange: (
    id: number,
    quantity: number,
    type: QuantityActionType,
  ) => void;
  handleRemove: (id: number) => void;
  onClose?: () => void;
}

export const ListCartDrawer: FC<ListCardDrawerProps> = ({
  items,
  totalAmount,
  loadingUpdateProductId,
  loadingRemoveId,
  loadingUpdate,
  errorUpdate,
  loadingRemove,
  errorRemove,
  onClose,
  handleQuantityChange,
  handleRemove,
}) => {
  const getPluralizeGoods = pluralize("товар", "товара", "товаров");
  const productsLength = items.length;

  return (
    <>
      <div className={s.top}>
        <p className={s.topInfo}>
          В корзине{" "}
          <b>
            {productsLength} {getPluralizeGoods(productsLength)}
          </b>
        </p>
        <Button
          color="transparent"
          onClick={onClose}
          noPadding
          className={s.close}
        >
          <Plus className={s.icon} />
        </Button>
      </div>

      <div className={s.cards}>
        {items.map((item) => (
          <ProductCardLine
            key={item.name}
            item={item}
            loadingUpdate={loadingUpdateProductId === item.id}
            errorUpdate={errorUpdate}
            loadingRemove={loadingRemoveId === item.id}
            errorRemove={errorRemove}
            onChangeCount={(type) =>
              handleQuantityChange(item.id, item.quantity, type)
            }
            onClickRemove={() => handleRemove(item.id)}
          />
        ))}
      </div>

      <div className={s.bottom}>
        <div className={s.bottomWrap}>
          <div className={s.bottomTextWrap}>
            <p className={s.bottomTitle}>Итого</p>
            <div className={s.line} />
            <p className={s.bottomPrice}>{totalAmount}</p>
          </div>
          {!errorUpdate && (
            <Button
              onClick={onClose}
              className={s.orderBtn}
              size="l"
              loading={loadingUpdate || loadingRemove}
            >
              Оформить заказ
              <Arrow className={s.orderIcon} />
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
