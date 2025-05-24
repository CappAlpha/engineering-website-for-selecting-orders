import { prisma } from "../../../../prisma/prisma-client";

interface GetSearchParams {
  query?: string;
  sortBy?: string;
  priceFrom?: number;
  priceTo?: number;
  tags?: string;
  //TODO: extend
  // limit?: string;
  // page?: string;
}

export type GetSearchParamsPage = Promise<GetSearchParams>;

const PRICE_CONFIG = {
  MIN_PRICE: 0,
  MAX_PRICE: 30000,
  SLIDER_GAP: 1000,
  SLIDER_STEP: 100,
} as const;

export const findProduct = async (params: GetSearchParamsPage) => {
  const { priceFrom, priceTo, tags } = await params;

  const minPriceRaw = Number(priceFrom);
  const minPrice = isNaN(minPriceRaw)
    ? PRICE_CONFIG.MIN_PRICE
    : Math.max(minPriceRaw, PRICE_CONFIG.MIN_PRICE);
  const maxPriceRaw = Number(priceTo);
  const maxPrice = isNaN(maxPriceRaw)
    ? PRICE_CONFIG.MAX_PRICE
    : Math.min(maxPriceRaw, PRICE_CONFIG.MAX_PRICE);

  const tagsArray: string[] =
    tags
      ?.split(",")
      .map((tag) => tag.trim())
      .filter(Boolean) ?? [];

  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          orderBy: {
            id: "desc",
          },
          where: {
            price: {
              gte: minPrice,
              lte: maxPrice,
            },
            ...(tagsArray &&
              tagsArray.length > 0 && {
                tags: {
                  hasSome: tagsArray,
                },
              }),
          },
        },
      },
    });

    const filteredCategories = categories.filter(
      (category) => category.products.length > 0,
    );

    return filteredCategories;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
