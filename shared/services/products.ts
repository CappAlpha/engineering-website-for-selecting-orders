import { Product } from "@prisma/client";

import { PageRoutes } from "@/constants/pages";

import { axiosInstance } from "./instance";

export const search = async (query: string): Promise<Product[]> => {
  return (
    await axiosInstance.get<Product[]>(PageRoutes.SEARCH_PRODUCTS, {
      params: { query },
    })
  ).data;
};
