import { prisma } from "../../../prisma/prisma-client";

export const getCategoryData = async (slug: string) => {
  return await prisma.category.findUnique({
    where: { slug },
    select: {
      slug: true,
      name: true,
      products: true,
    },
  });
};
