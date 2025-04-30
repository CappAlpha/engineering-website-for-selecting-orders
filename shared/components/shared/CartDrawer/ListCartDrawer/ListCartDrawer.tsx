import { type FC } from "react";

import { ProductCardLine } from "@/components/shared/ProductCardLine";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hook/useCart";
import { pluralize } from "@/utils/pluralize";

import { Arrow, Plus } from "../../../../../public/icon";

import s from "./ListCartDrawer.module.scss";

interface ListCardDrawerProps {
  onClose?: () => void;
}

export const ListCartDrawer: FC<ListCardDrawerProps> = ({ onClose }) => {
  const {
    items,
    totalAmount,

    loadingUpdateProductId,
    loadingRemoveId,

    loadingUpdate,
    loadingRemove,

    errorUpdate,
    errorRemove,

    handleQuantityChange,
    handleRemove,
  } = useCart();
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
