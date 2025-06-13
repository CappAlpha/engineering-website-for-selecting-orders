import { type MouseEvent } from "react";
import toast from "react-hot-toast";

import {
  CartQuantityLimits,
  QuantityAction,
  QuantityActionType,
} from "@/modules/Cart/constants/cart.ts";
import {
  useAddCartItemMutation,
  useClearCartMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateItemQuantityMutation,
} from "@/shared/api/client/cartQuery.ts";
import { useAppSelector } from "@/shared/hooks/useAppSelector";

export const useCartQueries = () => {
  const isCartQuery = useAppSelector((state) =>
    Object.values(state.cartApi.queries).some(
      (query) => query?.status === "pending",
    ),
  );

  const {
    data: cartData,
    isLoading: isCartLoading,
    error: cartError,
    refetch: refetchCart,
  } = useGetCartQuery();

  const [
    updateQuantity,
    { isLoading: isCartUpdating, error: cartUpdateError },
  ] = useUpdateItemQuantityMutation();

  const [addCartItem, { isLoading: isCartItemAdding }] =
    useAddCartItemMutation();

  const [removeItem, { isLoading: isCartRemoving }] =
    useRemoveCartItemMutation();

  const [clearCart, { isLoading: isCartClearing }] = useClearCartMutation();

  /**
   * Change quantity of item in cart
   * @param id - item id
   * @param quantity - current quantity
   * @param type - type of quantity change (plus or minus)
   */
  const handleQuantityChange = async (
    id: number,
    quantity: number,
    type: QuantityActionType,
  ) => {
    const newQuantity =
      type === QuantityAction.PLUS ? quantity + 1 : quantity - 1;

    if (
      newQuantity < CartQuantityLimits.MIN ||
      newQuantity > CartQuantityLimits.MAX
    ) {
      return;
    }

    await updateQuantity({ id, quantity: newQuantity });
  };

  /**
   * Add item to cart
   * @param e - mouse event
   * @param productId - product id
   */
  const addToCart = async (e: MouseEvent, productId: string) => {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();

    await toast.promise(addCartItem({ productId }).unwrap(), {
      loading: "Добавляем...",
      success: "Товар добавлен в корзину",
      error: (error) => error,
    });
  };

  /**
   * Remove item from cart
   * @param id - item id
   */
  const handleRemove = async (id: number) => {
    await toast.promise(removeItem({ id }).unwrap(), {
      loading: "Удаляем...",
      success: "Товар удалён из корзины!",
      error: (error) => error,
    });
  };

  /**
   * Remove all items from cart
   */
  const handleRemoveAll = async () => {
    await toast.promise(clearCart().unwrap(), {
      loading: "Очищаем корзину...",
      success: "Корзина очищена!",
      error: (error) => error,
    });
  };

  return {
    totalAmount: cartData?.totalAmount ?? 0,
    cartItems: cartData?.items ?? [],
    isCartLoading,
    cartError,
    refetchCart,

    handleQuantityChange,
    isCartUpdating,
    cartUpdateError,

    addToCart,
    isCartItemAdding,

    handleRemove,
    isCartRemoving,

    handleRemoveAll,
    isCartClearing,

    isCartQuery,
  };
};
