import { notFound } from "next/navigation";

import { ProductCard } from "@/modules/Catalog/ui/ProductCard";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";

import { prisma } from "../../../../prisma/prisma-client";

import s from "./page.module.scss";

// TODO: add meta?
export default async function CategoryPage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    select: {
      slug: true,
      name: true,
      products: true,
    },
  });

  if (!category) {
    return notFound();
  }

  const { name, products } = category;

  return (
    <div className={s.root}>
      <Breadcrumbs name={[name]} url={[slug]} pageWrap />
      <div className={s.wrap}>
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
