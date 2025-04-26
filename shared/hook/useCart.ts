import { MouseEvent } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import { QuantityAction, QuantityActionType } from "@/constants/cart";
import {
  updateItemQuantity,
  removeCartItem,
  addCartItem,
  CartState,
} from "@/store/cart/cartSlice";
import { AppDispatch } from "@/store/store";

import { useAppSelector } from "./useAppSelector";

export const CART_QUANTITY_LIMITS = {
  MIN: 1,
  MAX: 20,
};

interface UseCartReturn extends CartState {
  handleQuantityChange: (
    id: number,
    quantity: number,
    type: QuantityActionType,
  ) => void;
  handleRemove: (id: number) => void;
  addToCart: (e: MouseEvent, productId: string) => void;
}

/**
 * Custom hook to manage cart actions and state.
 * Provides methods to add, remove, and update cart items, and access cart state.
 * @returns {UseCartReturn} Cart state and action handlers
 */
export const useCart = (): UseCartReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useAppSelector((state) => state.cart);

  const handleQuantityChange = (
    id: number,
    quantity: number,
    type: QuantityActionType,
  ) => {
    const newQuantity =
      type === QuantityAction.PLUS ? quantity + 1 : quantity - 1;
    dispatch(updateItemQuantity({ id, quantity: newQuantity }));
  };

  const handleRemove = (id: number) => {
    toast.promise(dispatch(removeCartItem({ id })), {
      loading: "Удаляем...",
      success: "Товар удалён из корзины!",
      error: "Ошибка удаления товара",
    });
  };

  const addToCart = (e: MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toast.promise(dispatch(addCartItem({ values: { productId } })), {
      loading: "Добавляем...",
      success: "Товар добавлен в корзину",
      error: "Ошибка добавления товара",
    });
  };

  return {
    ...cart,
    handleQuantityChange,
    handleRemove,
    addToCart,
  };
};
