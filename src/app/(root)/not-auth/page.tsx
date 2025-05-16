import { redirect } from "next/navigation";

import { getUserSession } from "@/modules/Auth/actions/getUserSession";
import { PageInfoBlock } from "@/shared/ui/PageInfoBlock";

import { Unauthorized } from "../../../../public/icon";

import s from "./page.module.scss";

export default async function UnauthorizedPage() {
  const session = await getUserSession();

  if (session) {
    return redirect("/profile");
  }

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
