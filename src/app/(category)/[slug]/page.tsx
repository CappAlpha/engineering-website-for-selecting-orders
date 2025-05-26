import { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductCard } from "@/modules/Catalog/ui/ProductCard";
import { getCategoryData } from "@/shared/lib/getCategoryData";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";

import s from "./page.module.scss";

// Dynamic Metadata generation
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryData(slug);

  if (!category) {
    return {
      title: "Категория не найдена",
      description: "Запрашиваемую категорию невозможно найти.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${category.name} | Engineer`,
  };
}

export default async function CategoryPage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;

  const category = await getCategoryData(slug);
  if (!category) {
    return notFound();
  }

  const { name, products } = category;

  return (
    <div className={s.root}>
      <Breadcrumbs items={[{ name, url: slug }]} pageWrap />
      <div className={s.wrap}>
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
