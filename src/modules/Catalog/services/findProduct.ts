import { Prisma } from "@prisma/client";

import { CategoryWithDetails } from "@/shared/entities/category";

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
        category: true,
      },
    });

    const categoriesMap = new Map<number, CategoryWithDetails>();

    products.forEach((product) => {
      const categoryId = product.category.id;

      if (!categoriesMap.has(categoryId)) {
        categoriesMap.set(categoryId, {
          id: categoryId,
          name: product.category.name,
          products: [],
          slug: product.category.slug,
          createdAt: product.category.createdAt,
          updatedAt: product.category.updatedAt,
        });
      }

      categoriesMap.get(categoryId)?.products.push({ ...product });
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
