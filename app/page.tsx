import { Props as ProductCardProps } from "@/components/shared/ProductCard";
import { ProductsGroupList } from "@/components/shared/ProductsGroupList";
import { Filters } from "@/components/shared/Filters";
import { TopBar } from "@/components/shared/TopBar";
import s from "./page.module.scss";
import { Category } from "@prisma/client";

const CATEGORIES: Pick<Category, "id" | "name">[] = [
  {
    id: 1,
    name: 'Чертежи',
  },
  {
    id: 2,
    name: 'БЭМ',
  },
  {
    id: 3,
    name: 'Геология',
  },
  {
    id: 4,
    name: 'Программы на C++',
  },
];

const PRODUCTS: ProductCardProps[] = [
  {
    id: 1,
    name: "Чертёж Детали",
    description: "123232 3213213",
    price: 895,
    imageUrl: "/images/catalog/1.webp",
  },
  {
    id: 2,
    name: "Чертёж Мост",
    description: `123232 3213213`,
    price: 2395,
    imageUrl: "/images/catalog/1.jpeg",
  },
  {
    id: 3,
    name: "Чертёж Здания",
    description: `123232 3213213`,
    price: 4395,
    imageUrl: "/images/catalog/1.webp",
  },
  {
    id: 4,
    name: "Начерт",
    description: `123232 3213213`,
    price: 395,
    imageUrl: "/images/catalog/1.webp",
  },
];

export default function Home() {
  return (
    <>
      <div className={s.wrap}>
        <h1 className={s.title}>Все заказы</h1>
      </div>

      <TopBar categories={CATEGORIES} />

      <div className={s.wrapCatalog}>
        <Filters />
        <div className={s.wrapProducts}>
          <ProductsGroupList id={CATEGORIES[0].id} name={CATEGORIES[0].name} items={PRODUCTS} />
          <ProductsGroupList id={CATEGORIES[1].id} name={CATEGORIES[1].name} items={PRODUCTS} />
          <ProductsGroupList id={CATEGORIES[2].id} name={CATEGORIES[2].name} items={PRODUCTS} />
        </div>
      </div>
    </>
  );
}
