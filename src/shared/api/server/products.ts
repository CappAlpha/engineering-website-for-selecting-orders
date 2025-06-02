import { Product } from "@prisma/client";

import { PageConfig } from "../../constants/pages";
import { PriceRange } from "../client/productsQuery";
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

export const getPriceRange = async (): Promise<PriceRange> => {
  return (await axiosInstance.get<PriceRange>(PageConfig.PRICE_RANGE)).data;
};
