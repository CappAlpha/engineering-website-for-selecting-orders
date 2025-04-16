import { prisma } from "../../../prisma/prisma-client";
import { notFound } from "next/navigation";
import s from "./page.module.scss";
import Image from "next/image";

export default async function ProductPage({
  params: { id },
}: Readonly<{ params: { id: string } }>) {
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
      <div className={s.right}>
        <ul>
          <li>{name}</li>
          <li>{description}</li>
        </ul>
      </div>
    </div>
  );
}
