import { Footer } from "@/shared/ui/Footer";
import { Header } from "@/shared/ui/Header";
import { PageInfoBlock } from "@/shared/ui/PageInfoBlock";

import { NotFound } from "../../public/icon";

import s from "./not-found.module.scss";

export default async function NotFoundPage() {
  return (
    <>
      <Header />
      <div className={s.wrap}>
        <PageInfoBlock
          title="Страница не найдена"
          description="Проверьте корректность введённого адреса или повторите попытку позже"
          icon={<NotFound />}
        />
      </div>
      <Footer />
    </>
  );
}
