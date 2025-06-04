import { Prisma } from "@prisma/client";

export const buildProductConditions = (
  query?: string,
  priceFrom?: number,
  priceTo?: number,
  tagsArray?: string[],
): Prisma.ProductWhereInput => {
  const conditions: Prisma.ProductWhereInput = {};

  if (priceFrom !== undefined || priceTo !== undefined) {
    conditions.price = {};
    if (priceFrom !== undefined) conditions.price.gte = priceFrom;
    if (priceTo !== undefined) conditions.price.lte = priceTo;
  }

  if (query) {
    conditions.name = { contains: query, mode: "insensitive" };
  }

  if (tagsArray && tagsArray.length > 0) {
    conditions.tags = { hasSome: tagsArray };
  }

  return conditions;
};
