import { ProductsGroupList } from "@/components/shared/ProductsGroupList";
import { Filters } from "@/components/shared/Filters";
import { TopBar } from "@/components/shared/TopBar";
import { prisma } from "../prisma/prisma-client";
import s from "./page.module.scss";

export default async function Home() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        include: {
          tags: true,
        },
      },
    },
  });

  const filteredCategories = categories.filter(
    (category) => category.products.length > 0,
  );

  return (
    <>
      <div className={s.wrap}>
        <h1 className={s.title}>Все заказы</h1>
      </div>

      <TopBar categories={filteredCategories} />

      <div className={s.wrapCatalog}>
        <Filters />
        <div className={s.wrapProducts}>
          {filteredCategories.map(({ id, name, products }) => (
            <ProductsGroupList key={id} id={id} name={name} items={products} />
          ))}
        </div>
      </div>
    </>
  );
}
