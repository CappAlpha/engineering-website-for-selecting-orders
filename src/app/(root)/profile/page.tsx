import { redirect } from "next/navigation";

import { getUserSession } from "@/modules/Auth/actions/getUserSession";

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

  return (
    <div className={s.wrap}>
      <h1 className={s.title}>{user?.fullName}</h1>
    </div>
  );
}
