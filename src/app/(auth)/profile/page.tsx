import { redirect } from "next/navigation";

import { getUserSession } from "@/modules/Auth/services/getUserSession";
import { ProfileForm } from "@/modules/Auth/ui/ProfileForm";
import { ProductCardCreate } from "@/modules/Catalog/ui/ProductCardCreate";
import type { CategoryBase } from "@/shared/entities/category";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { Search } from "@/shared/ui/Search";

import { prisma } from "../../../../prisma/prisma-client";

import s from "./page.module.scss";

export default async function ProfilePage() {
  const session = await getUserSession();

  if (!session) {
    return redirect("/not-auth");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.id,
    },
  });

  if (!user) {
    return redirect("/not-auth");
  }

  let categories: CategoryBase[] = [];

  if (user.role === "ADMIN") {
    categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
  }

  return (
    <div className={s.wrap}>
      <Breadcrumbs items={[{ name: "Профиль", url: "profile" }]} />
      {user.role === "ADMIN" && (
        <div className={s.adminWrap}>
          <ProductCardCreate categories={categories} />
          <div className={s.search}>
            <h2 className={s.title}>Панель мониторинга товаров</h2>
            <Search categories={categories} isAdmin />
          </div>
        </div>
      )}
      <ProfileForm data={user} />
    </div>
  );
}
