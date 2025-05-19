import { Product } from "@prisma/client";

import { PageConfig } from "../constants/pages";
import { axiosInstance } from "./instance";

export const search = async (
  query: string,
  signal: AbortSignal,
): Promise<Product[]> => {
  return (
    await axiosInstance.get<Product[]>(PageConfig.SEARCH_PRODUCTS, {
      params: { query },
      signal: signal,
    })
  ).data;
};
