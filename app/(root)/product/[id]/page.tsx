import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductProperties } from "@/components/shared/ProductProperties";

import { prisma } from "../../../../prisma/prisma-client";

import s from "./page.module.scss";

async function getData(id: string) {
  const product = await prisma.product.findUnique({
    where: { id: id },
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      price: true,
      tags: true,
    },
  });
  return product;
}

// Динамическая генерация метаданных
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getData(id);

  if (!product) {
    return {
      title: "Продукт не найден",
      description: "Запрашиваемый продукт невозможно найти.",
    };
  }

  return {
    title: product.name,
    description: product.description || "Изучите этот прекрасный продукт!",
    keywords: product.tags || ["Продукт", "Магазин"],
    alternates: {
      canonical: `/products/${id}`,
    },
    openGraph: {
      title: product.name,
      description: product.description || "Изучите этот прекрасный продукт!",
      images: product.imageUrl
        ? [{ url: product.imageUrl, alt: product.name }]
        : [],
      url: `/products/${id}`,
    },
  };
}

export default async function ProductPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const product = await getData(id);

  if (!product) {
    return notFound();
  }

  const { imageUrl, name, description, price, tags } = product;

  return (
    <div className={s.root}>
      <Breadcrumbs aria-label="breadcrumb" className={s.breadcrumb}>
        <Link href="/">Главная</Link>
        <span aria-current="page">{name}</span>
      </Breadcrumbs>
      <div className={s.wrap}>
        <div className={s.left}>
          <Image
            className={s.img}
            src={imageUrl}
            alt={name}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill
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
