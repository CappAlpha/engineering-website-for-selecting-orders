import { Category } from "@prisma/client";
import { redirect } from "next/navigation";

import { getUserSession } from "@/modules/Auth/services/getUserSession";
import { ProfileForm } from "@/modules/Auth/ui/ProfileForm";
import { ProductCardCreate } from "@/modules/Catalog/ui/ProductCardCreate";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";

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

  let categories: Omit<Category, "createdAt" | "updatedAt">[] = [];

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
      {user.role === "ADMIN" && <ProductCardCreate categories={categories} />}
      <ProfileForm data={user} />
    </div>
  );
}
