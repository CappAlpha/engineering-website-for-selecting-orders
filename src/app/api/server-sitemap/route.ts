import { getServerSideSitemap, ISitemapField } from "next-sitemap";

import { prisma } from "../../../../prisma/prisma-client";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        updatedAt: true,
      },
      take: 200,
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
  } catch (err) {
    console.error("[SITEMAP_GET] Error generating sitemap:", err);
    return getServerSideSitemap([]);
  }
}
