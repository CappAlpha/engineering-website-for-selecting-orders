import { PageInfoBlock } from "@/shared/ui/PageInfoBlock";

import { Unauthorized } from "../../../../public/icon";

import s from "./page.module.scss";

export default async function UnauthorizedPage() {
  return (
    <div className={s.wrap}>
      <PageInfoBlock
        title="Доступ запрещен"
        description="Данную страницу могут просматривать только авторизованные пользователи"
        icon={<Unauthorized />}
      />
    </div>
  );
}
