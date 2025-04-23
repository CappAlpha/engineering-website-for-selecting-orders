import { pageConfig } from "@/constants/pages";
import { CartDTO } from "@/entities/cart";

import { axiosInstance } from "./instance";

export const getCart = async (): Promise<CartDTO> => {
  return (await axiosInstance.get<CartDTO>(pageConfig.CART)).data;
};

export const updateItemsQuantity = async (
  itemId: number,
  quantity: number,
): Promise<CartDTO> => {
  return (
    await axiosInstance.patch<CartDTO>(pageConfig.CART + itemId, { quantity })
  ).data;
};
