import { prisma } from "../../../../prisma/prisma-client";

/**
 * Gets product data by id.
 * @param id - id of the product
 * @returns data of the product
 */
export const getProductData = async (id: string) => {
  return prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      price: true,
      tags: true,
      category: {
        select: {
          slug: true,
          name: true,
        },
      },
    },
  });
};
