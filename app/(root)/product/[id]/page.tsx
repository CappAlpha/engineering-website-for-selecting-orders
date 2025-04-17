import { prisma } from "../../../../prisma/prisma-client";
import { notFound } from "next/navigation";
import s from "./page.module.scss";
import Image from "next/image";

export default async function ProductPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const product = await prisma.product.findFirst({ where: { id: Number(id) } });

  if (!product) {
    return notFound();
  }

  const { imageUrl, name, description } = product;

  return (
    <div className={s.root}>
      <div className={s.left}>
        <Image
          className={s.img}
          src={imageUrl}
          alt={name}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill
        />
      </div>
      <ul className={s.right}>
        <li>
          <h2 className={s.title}>{name}</h2>
        </li>
        <li>{description}</li>
      </ul>
    </div>
  );
}
