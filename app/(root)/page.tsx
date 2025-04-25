import { Filters } from "@/components/shared/Filters";
import { ProductsCatalog } from "@/components/shared/ProductsCatalog";
import { TopBar } from "@/components/shared/TopBar";
import { findProduct, GetSearchParams } from "@/utils/findProduct";

import s from "./page.module.scss";

export default async function Home({
  searchParams,
}: Readonly<{ searchParams: GetSearchParams }>) {
  const testCat = await findProduct(searchParams);

  const filteredCategories = testCat.filter(
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
        <ProductsCatalog categories={filteredCategories} />
      </div>
    </>
  );
}
