import { Api } from "@/shared/api/server/apiServer";

import { GetSearchParams } from "./findProduct";

export const validateAndNormalizeParams = async (params: GetSearchParams) => {
  const { minPrice: globalMinPrice, maxPrice: globalMaxPrice } =
    await Api.products.getPriceRange();

  const priceFrom =
    params.minPrice !== undefined
      ? Math.max(Number(params.minPrice), globalMinPrice)
      : undefined;

  const priceTo =
    params.maxPrice !== undefined
      ? Math.min(Number(params.maxPrice), globalMaxPrice)
      : undefined;

  const tagsArray =
    params.tags
      ?.split(",")
      .map((tag) => tag.trim())
      .filter(Boolean) || [];

  return {
    query: params.query?.trim(),
    priceFrom,
    priceTo,
    tagsArray,
  };
};
