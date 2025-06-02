import { Prisma } from "@prisma/client";

import { Api } from "@/shared/api/server/apiServer";

import { prisma } from "../../../../prisma/prisma-client";

interface GetSearchParams {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string;
  // TODO: add pagination?
  // limit?: number;
  // page?: number;
}

export type GetSearchParamsPage = Promise<GetSearchParams>;

// TODO: improve?
const validateAndNormalizeParams = async (params: GetSearchParams) => {
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

const buildProductWhereClause = (
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

export const findProduct = async (params: GetSearchParamsPage) => {
  try {
    const normalizedParams = await validateAndNormalizeParams(await params);
    const { query, priceFrom, priceTo, tagsArray } = normalizedParams;

    const productWhereClause = buildProductWhereClause(
      query,
      priceFrom,
      priceTo,
      tagsArray,
    );

    // Optimized query - first find products, then group by category
    const products = await prisma.product.findMany({
      where: productWhereClause,
      orderBy: {
        id: "desc",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const categoriesMap = new Map();

    products.forEach((product) => {
      const categoryId = product.category.id;

      if (!categoriesMap.has(categoryId)) {
        categoriesMap.set(categoryId, {
          id: categoryId,
          name: product.category.name,
          products: [],
        });
      }

      categoriesMap.get(categoryId).products.push({
        ...product,
        category: undefined,
      });
    });

    const categories = Array.from(categoriesMap.values());

    return {
      categories,
    };
  } catch (error) {
    console.error("Error fetching products:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Database error code:", error.code);
    }

    return {
      categories: [],
    };
  }
};
