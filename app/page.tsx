import { Props as ProductCardProps } from "@/components/shared/ProductCard";
import { ProductsGroupList } from "@/components/shared/ProductsGroupList";
import { Filters } from "@/components/shared/Filters";
import { TopBar } from "@/components/shared/TopBar";
import { Api } from "../services/api-client";
import { Category } from "@prisma/client";
import s from "./page.module.scss";

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

async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await Api.categories.getAll();
    return response;
  } catch (error) {
    console.error("Ошибка при получении категорий:", error);
    return [];
  }
}

export default async function Home() {
  const categories = await fetchCategories();

  return (
    <>
      <div className={s.wrap}>
        <h1 className={s.title}>Все заказы</h1>
      </div>

      <TopBar categories={categories} />

      <div className={s.wrapCatalog}>
        <Filters />
        <div className={s.wrapProducts}>
          <ProductsGroupList
            id={categories[0].id}
            name={categories[0].name}
            items={PRODUCTS}
          />
          <ProductsGroupList
            id={categories[1].id}
            name={categories[1].name}
            items={PRODUCTS}
          />
          <ProductsGroupList
            id={categories[2].id}
            name={categories[2].name}
            items={PRODUCTS}
          />
        </div>
      </div>
    </>
  );
}
