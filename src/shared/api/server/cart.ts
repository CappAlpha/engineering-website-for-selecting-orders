import { CartDTO, CreateCartItemValues } from "@/modules/Cart/entities/cart";
import { PageConfig } from "@/shared/constants/pages";

import { axiosInstance } from "./instance";

export const getCart = async (): Promise<CartDTO> => {
  return (await axiosInstance.get<CartDTO>(PageConfig.CART)).data;
};

export const updateItemQuantity = async (
  id: number,
  quantity: number,
): Promise<CartDTO> => {
  return (
    await axiosInstance.patch<CartDTO>(PageConfig.CART + id, { quantity })
  ).data;
};

export const removeCartItem = async (id: number): Promise<CartDTO> => {
  return (await axiosInstance.delete<CartDTO>(PageConfig.CART + id)).data;
};

export const removeCartItems = async (): Promise<CartDTO> => {
  return (await axiosInstance.delete<CartDTO>(PageConfig.CART)).data;
};

export const addCartItem = async (
  values: CreateCartItemValues,
): Promise<CartDTO> => {
  return (await axiosInstance.post<CartDTO>(PageConfig.CART, values)).data;
};
