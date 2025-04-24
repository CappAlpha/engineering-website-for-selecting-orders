import { MouseEvent, useCallback } from "react";
import { useDispatch } from "react-redux";

import { QuantityAction, QuantityActionType } from "@/constants/cart";
import {
  cartActions,
  updateItemQuantity,
  removeCartItem,
  addCartItem,
  CartState,
} from "@/store/cart/cartSlice";
import { AppDispatch } from "@/store/store";

import { useAppSelector } from "./useAppSelector";

const CART_QUANTITY_LIMITS = {
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

  const handleQuantityChange = useCallback(
    (id: number, quantity: number, type: QuantityActionType) => {
      const newQuantity =
        type === QuantityAction.PLUS ? quantity + 1 : quantity - 1;
      if (
        newQuantity < CART_QUANTITY_LIMITS.MIN ||
        newQuantity > CART_QUANTITY_LIMITS.MAX
      )
        return;
      dispatch(cartActions.resetError());
      dispatch(updateItemQuantity({ id, quantity: newQuantity }));
    },
    [dispatch],
  );

  const handleRemove = useCallback(
    (id: number) => {
      dispatch(cartActions.resetError());
      dispatch(removeCartItem({ id }));
    },
    [dispatch],
  );

  const addToCart = useCallback(
    (e: MouseEvent, productId: string) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(cartActions.resetError());
      dispatch(addCartItem({ values: { productId } }));
    },
    [dispatch],
  );

  return {
    ...cart,
    handleQuantityChange,
    handleRemove,
    addToCart,
  };
};
