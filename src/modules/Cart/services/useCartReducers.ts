import { type MouseEvent } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import {
  QuantityActionType,
  QuantityAction,
  CartQuantityLimits,
} from "@/modules/Cart/constants/cart.ts";
import type { AppDispatch } from "@/store/store";

import {
  addCartItem,
  fetchCartItems,
  removeCartItem,
  removeCartItems,
  updateItemQuantity,
} from "../store/cartSlice.ts";

/**
 * Custom hook for cart operations with toast notifications
 * @returns {Object} Cart action handlers
 */
export const useCartReducers = () => {
  const dispatch = useDispatch<AppDispatch>();

  /**
   * Fetches cart items from server with toast notifications
   */
  const fetchCart = async (): Promise<void> => {
    await dispatch(fetchCartItems());
  };

  /**
   * Change quantity of item in cart
   * @param id - item id
   * @param quantity - current quantity
   * @param type - type of quantity change (plus or minus)
   * @returns {Promise<void>}
   */
  const handleQuantityChange = async (
    id: number,
    quantity: number,
    type: QuantityActionType,
  ): Promise<void> => {
    const newQuantity =
      type === QuantityAction.PLUS ? quantity + 1 : quantity - 1;

    if (
      newQuantity < CartQuantityLimits.MIN ||
      newQuantity > CartQuantityLimits.MAX
    ) {
      return;
    }

    await dispatch(updateItemQuantity({ id, quantity: newQuantity }));
  };

  /**
   * Add item to cart
   * @param e - mouse event
   * @param productId - product id
   * @returns {Promise<void>}
   */
  const addToCart = async (e: MouseEvent, productId: string): Promise<void> => {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();

    await toast.promise(
      dispatch(addCartItem({ values: { productId } })).unwrap(),
      {
        loading: "Добавляем...",
        success: "Товар добавлен в корзину",
        error: "Ошибка удаления товара",
      },
    );
  };

  /**
   * Remove item from cart
   * @param id - item id
   * @returns {Promise<void>}
   */
  const handleRemove = async (id: number): Promise<void> => {
    await toast.promise(dispatch(removeCartItem({ id })).unwrap(), {
      loading: "Удаляем...",
      success: "Товар удалён из корзины!",
      error: "Ошибка удаления товара",
    });
  };

  /**
   * Remove items from cart
   * @param id - cart id
   * @returns {Promise<void>}
   */
  const handleRemoveAll = async (): Promise<void> => {
    await toast.promise(dispatch(removeCartItems()).unwrap(), {
      loading: "Удаляем...",
      success: "Корзина очищена!",
      error: "Ошибка очистки корзины",
    });
  };

  return {
    fetchCart,
    handleQuantityChange,
    addToCart,
    handleRemove,
    handleRemoveAll,
  };
};
