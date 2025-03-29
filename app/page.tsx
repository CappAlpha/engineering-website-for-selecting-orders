import { TopBar } from "@/components/shared/TopBar";

import s from "./page.module.scss";
import { Filters } from "@/components/shared/Filters";
import { ProductsGroupList } from "@/components/shared/ProductsGroupList";
import { Props as  ProductCardProps} from "@/components/shared/ProductCard";

const PRODUCTS: ProductCardProps[] = [
  {
    id: 1,
    name: 'Чертёж Детали',
    description: 'В кратчайшие сроки по ГОСТу',
    price: 895,
    imageUrl: '/images/catalog/1.webp'
  },
  {
    id: 2,
    name: 'Чертёж Мост',
    description: 'В кратчайшие сроки по ГОСТу',
    price: 2395,
    imageUrl: '/images/catalog/1.webp'
  },
  {
    id: 3,
    name: 'Чертёж Здания',
    description: 'В кратчайшие сроки по ГОСТу',
    price: 4395,
    imageUrl: '/images/catalog/1.webp'
  },
  {
    id: 4,
    name: 'Начерт',
    description: 'В кратчайшие сроки',
    price: 395,
    imageUrl: '/images/catalog/1.webp'
  },
]

export default function Home() {
  return (
    <>
      <div className={s.wrap}>
        <h1 className={s.title}>Все заказы</h1>
      </div>

      <TopBar />

      <div className={s.wrapCatalog} style={{ height: "400dvh" }}>
        <Filters />
        <div className={s.wrapProducts}>
          <ProductsGroupList title="Чертежи" items={PRODUCTS} categoryId={1} />
          <ProductsGroupList title="БЭМ" items={PRODUCTS} categoryId={2} />
        </div>
      </div>
    </>
  );
}
