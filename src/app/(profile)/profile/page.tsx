import { redirect } from "next/navigation";

import { getUserSession } from "@/modules/Auth/services/getUserSession";
import { ProfileForm } from "@/modules/Auth/ui/ProfileForm";
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

  return (
    <div className={s.wrap}>
      <Breadcrumbs items={[{ name: "Профиль", url: "profile" }]} />
      <ProfileForm data={user} />
    </div>
  );
}
