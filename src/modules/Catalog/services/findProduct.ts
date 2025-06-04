import { Prisma } from "@prisma/client";

import { prisma } from "../../../../prisma/prisma-client";
import { buildProductConditions } from "./buildProductConditions";
import { validateAndNormalizeParams } from "./validateAndNormalizeParams";

export interface GetSearchParams {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string;
  // TODO: add pagination?
  // limit?: number;
  // page?: number;
}

export type GetSearchParamsPage = Promise<GetSearchParams>;

export const findProduct = async (params: GetSearchParamsPage) => {
  try {
    const normalizedParams = await validateAndNormalizeParams(await params);
    const { query, priceFrom, priceTo, tagsArray } = normalizedParams;

    const productWhereClause = buildProductConditions(
      query,
      priceFrom,
      priceTo,
      tagsArray,
    );

    // Optimized query - first find products, then group by category
    const products = await prisma.product.findMany({
      where: productWhereClause,
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
