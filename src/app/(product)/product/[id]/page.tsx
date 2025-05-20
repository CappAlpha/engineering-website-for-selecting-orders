import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getProductData } from "@/modules/ProductPage/services/getProductData";
import { ProductProperties } from "@/modules/ProductPage/ui/ProductProperties";
import { PageConfig } from "@/shared/constants/pages";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";

import s from "./page.module.scss";

// Dynamic Metadata generation
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductData(id);

  if (!product) {
    return {
      title: "Продукт не найден",
      description: "Запрашиваемый продукт невозможно найти.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${product.name} | Engineer`,
    description: product.description ?? "Изучите этот прекрасный продукт!",
    keywords: product.tags ?? ["Продукт", "Магазин"],
    metadataBase: new URL(process.env.DOMAIN ?? ""),
    alternates: {
      canonical: `${PageConfig.PRODUCT}${id}`,
    },
    openGraph: {
      title: product.name,
      description: product.description ?? "Изучите этот прекрасный продукт!",
      images: product.imageUrl
        ? [
            {
              url: product.imageUrl,
              alt: product.name,
              width: 1200,
              height: 630,
            },
          ]
        : [],
      url: `/products/${id}`,
      locale: "ru_RU",
      siteName: "Engineer",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description ?? "Изучите этот прекрасный продукт!",
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;

  const product = await getProductData(id);
  if (!product) {
    return notFound();
  }

  const { imageUrl, name, description, price, tags } = product;

  return (
    <div className={s.root}>
      <Breadcrumbs name={name} pageWrap />
      <div className={s.wrap}>
        <div className={s.left}>
          <Image
            className={s.img}
            src={imageUrl}
            alt={`${name} - картинка продукта`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill
            priority
          />
        </div>
        <ProductProperties
          id={id}
          name={name}
          description={description}
          price={price}
          tags={tags}
        />
      </div>
    </div>
  );
}
