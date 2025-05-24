import {
  GetSearchParamsPage,
  findProduct,
} from "@/modules/Catalog/services/findProduct";
import { Filters } from "@/modules/Catalog/ui/Filters";
import { ProductsCatalog } from "@/modules/Catalog/ui/ProductsCatalog";
import { TopBar } from "@/modules/Catalog/ui/TopBar";

import s from "./page.module.scss";

export default async function Home({
  searchParams,
}: Readonly<{ searchParams: GetSearchParamsPage }>) {
  const categories = await findProduct(searchParams);

  const categoriesFiltered = categories.map(({ id, name }) => ({
    id: id,
    name: name,
  }));

  return (
    <>
      <div className={s.wrap}>
        <h1 className={s.title}>Все заказы</h1>
      </div>

      <TopBar categories={categoriesFiltered} />

      <div className={s.wrapCatalog}>
        <Filters />
        <ProductsCatalog categories={categories} />
      </div>
    </>
  );
}
