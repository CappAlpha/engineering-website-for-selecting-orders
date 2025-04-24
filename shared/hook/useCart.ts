import { MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import { QuantityAction, QuantityActionType } from "@/constants/cart";
import {
  cartActions,
  updateItemQuantity,
  removeCartItem,
  addCartItem,
} from "@/store/cart/cartSlice";
import { AppDispatch, RootState } from "@/store/store";

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart);

  const handleQuantityChange = (
    id: number,
    quantity: number,
    type: QuantityActionType,
  ) => {
    const newQuantity =
      type === QuantityAction.PLUS ? quantity + 1 : quantity - 1;
    if (newQuantity < 1 || newQuantity > 20) return;
    dispatch(cartActions.resetError());
    dispatch(updateItemQuantity({ id, quantity: newQuantity }));
  };

  const handleRemove = (id: number) => {
    dispatch(cartActions.resetError());
    dispatch(removeCartItem({ id }));
  };

  const addToCart = (e: MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(cartActions.resetError());
    dispatch(addCartItem({ values: { productId } }));
  };

  return {
    ...cart,
    handleQuantityChange,
    handleRemove,
    addToCart,
  };
};
