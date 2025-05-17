import { redirect } from "next/navigation";

import { getUserSession } from "@/modules/Auth/actions/getUserSession";
import { ProfileForm } from "@/modules/Auth/ui/ProfileForm";

import { prisma } from "../../../../prisma/prisma-client";

import s from "./page.module.scss";

export default async function PagePage() {
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
      <ProfileForm data={user} />
    </div>
  );
}
