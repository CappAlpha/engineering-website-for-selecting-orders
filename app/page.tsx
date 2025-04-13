import { Props as ProductCardProps } from "@/components/shared/ProductCard";
import { ProductsGroupList } from "@/components/shared/ProductsGroupList";
import { Filters } from "@/components/shared/Filters";
import { TopBar } from "@/components/shared/TopBar";
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
    imageUrl: "/images/catalog/2.jpeg",
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

      <TopBar />

      <div className={s.wrapCatalog}>
        <Filters />
        <div className={s.wrapProducts}>
          <ProductsGroupList title="Чертежи" items={PRODUCTS} categoryId={1} />
          <ProductsGroupList title="БЭМ" items={PRODUCTS} categoryId={2} />
          <ProductsGroupList title="Геология" items={PRODUCTS} categoryId={3} />
        </div>
      </div>
    </>
  );
}
