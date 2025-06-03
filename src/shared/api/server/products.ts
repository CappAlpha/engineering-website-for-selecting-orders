import { PageConfig } from "../../constants/pages";
import { PriceRange } from "../client/productsQuery";
import { axiosInstance } from "./instance";

export const getPriceRange = async (): Promise<PriceRange> => {
  return (await axiosInstance.get<PriceRange>(PageConfig.PRICE_RANGE)).data;
};
