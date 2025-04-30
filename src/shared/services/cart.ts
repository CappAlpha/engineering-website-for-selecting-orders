import { CartDTO, CreateCartItemValues } from "../../entities/cart";
import { pageConfig } from "../constants/pages";
import { axiosInstance } from "./instance";

export const getCart = async (): Promise<CartDTO> => {
  return (await axiosInstance.get<CartDTO>(pageConfig.CART)).data;
};

export const updateItemQuantity = async (
  id: number,
  quantity: number,
): Promise<CartDTO> => {
  return (
    await axiosInstance.patch<CartDTO>(pageConfig.CART + id, { quantity })
  ).data;
};

export const removeCartItem = async (id: number): Promise<CartDTO> => {
  return (await axiosInstance.delete<CartDTO>(pageConfig.CART + id)).data;
};

export const addCartItem = async (
  values: CreateCartItemValues,
): Promise<CartDTO> => {
  return (await axiosInstance.post<CartDTO>(pageConfig.CART, values)).data;
};
