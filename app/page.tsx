import { TopBar } from "@/components/shared/TopBar";

import s from "./page.module.scss";
import { Filters } from "@/components/shared/Filters";

export default function Home() {
  return (
    <>
      <div className={s.wrap}>
        <h1 className={s.title}>Все заказы</h1>
      </div>

      <TopBar />

      <div className={s.wrapCatalog} style={{height: "400dvh"}}>
        <Filters />
        <div>catalog</div>
      </div>
    </>
  );
}
