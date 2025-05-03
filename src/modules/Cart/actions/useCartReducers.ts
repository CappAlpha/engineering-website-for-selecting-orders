import { type MouseEvent } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import {
  QuantityActionType,
  QuantityAction,
  CART_QUANTITY_LIMITS,
} from "@/shared/constants/cart";
import type { AppDispatch } from "@/store/store";

import {
  addCartItem,
  fetchCartItems,
  removeCartItem,
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
    await toast.promise(dispatch(fetchCartItems()).unwrap(), {
      loading: "Делаем запрос...",
      success: "Успешно!",
      error: (err: Error) => err.message || "Ошибка выполнения запроса",
    });
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
      newQuantity < CART_QUANTITY_LIMITS.MIN ||
      newQuantity > CART_QUANTITY_LIMITS.MAX
    ) {
      return;
    }

    await dispatch(updateItemQuantity({ id, quantity: newQuantity }));
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
      error: (err: Error) => err.message || "Ошибка удаления товара",
    });
  };

  /**
   * Add item to cart
   * @param e - mouse event
   * @param productId - product id
   * @returns {Promise<void>}
   */
  const addToCart = async (e: MouseEvent, productId: string): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();

    await toast.promise(
      dispatch(addCartItem({ values: { productId } })).unwrap(),
      {
        loading: "Добавляем...",
        success: "Товар добавлен в корзину",
        error: (err: Error) => err.message || "Ошибка удаления товара",
      },
    );
  };

  return {
    fetchCart,
    handleQuantityChange,
    handleRemove,
    addToCart,
  };
};
