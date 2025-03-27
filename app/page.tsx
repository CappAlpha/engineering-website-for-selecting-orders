import { Tabs } from "@/components/ui/Tabs";
import { SortDropdown } from "@/components/shared/SortDropdown";

import s from "./page.module.scss";

export default function Home() {
  return (
    <div className={s.wrap}>
      <h1 className={s.title}>Все заказы</h1>
      <div className={s.mainFilter}>
        <Tabs />
        <SortDropdown />
      </div>
    </div>
  );
}
