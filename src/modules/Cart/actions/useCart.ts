import { MouseEvent } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import {
  QuantityActionType,
  QuantityAction,
  CART_QUANTITY_LIMITS,
} from "@/shared/constants/cart";
import { AppDispatch } from "@/store/store";

import {
  selectIsItemUpdating,
  selectIsItemAdding,
  selectIsItemRemoving,
} from "../store/cartSelectors";
import {
  addCartItem,
  removeCartItem,
  updateItemQuantity,
} from "../store/cartSlice.ts";

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleQuantityChange = async (
    id: number,
    quantity: number,
    type: QuantityActionType,
  ) => {
    const newQuantity =
      type === QuantityAction.PLUS ? quantity + 1 : quantity - 1;
    if (
      newQuantity >= CART_QUANTITY_LIMITS.MIN &&
      newQuantity <= CART_QUANTITY_LIMITS.MAX
    ) {
      dispatch(updateItemQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemove = async (id: number) => {
    toast.promise(dispatch(removeCartItem({ id })).unwrap(), {
      loading: "Удаляем...",
      success: "Товар удалён из корзины!",
      error: (err) => err.message ?? "Ошибка удаления товара",
    });
  };

  const addToCart = async (e: MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();

    toast.promise(dispatch(addCartItem({ values: { productId } })).unwrap(), {
      loading: "Добавляем...",
      success: "Товар добавлен в корзину",
      error: (err) => err.message ?? "Ошибка добавления в корзину",
    });
  };

  return {
    handleQuantityChange,
    handleRemove,
    addToCart,
    selectIsItemUpdating,
    selectIsItemAdding,
    selectIsItemRemoving,
  };
};
