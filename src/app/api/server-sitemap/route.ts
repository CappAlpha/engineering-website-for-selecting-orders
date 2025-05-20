import { getServerSideSitemap, ISitemapField } from "next-sitemap";

import { prisma } from "../../../../prisma/prisma-client";

export async function GET() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  });

  const productFields: ISitemapField[] = products.map((product) => ({
    loc: `${process.env.DOMAIN}/product/${product.id}`,
    lastmod: product.updatedAt.toISOString(),
    changefreq: "daily",
    priority: 0.8,
  }));

  const staticPages: ISitemapField[] = [
    {
      loc: `${process.env.DOMAIN}`,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: 1.0,
    },
  ];

  return getServerSideSitemap([...staticPages, ...productFields]);
}
