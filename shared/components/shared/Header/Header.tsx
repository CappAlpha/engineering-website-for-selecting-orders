import Link from "next/link";
import { type FC } from "react";

import { SearchInput } from "@/components/shared/Header/SearchInput";
import { Button } from "@/components/ui/Button";

import { prisma } from "../../../../prisma/prisma-client";
import { Settings, User } from "../../../../public/icon/";
import { CartBtn } from "../CartBtn";

import s from "./Header.module.scss";

interface Props {
  isCheckoutPage?: boolean;
}

export const Header: FC<Props> = async ({ isCheckoutPage = false }) => {
  const categories = await prisma.category.findMany();

  return (
    <header className={s.root}>
      <div className={s.wrap}>
        <Link className={s.left} href={"/"}>
          <Settings className={s.engIcon} />
          <h2 className={s.title}>Engineer</h2>
        </Link>

        {!isCheckoutPage && <SearchInput categories={categories} />}

        <div className={s.right}>
          <Button>
            <User className={s.userIcon} /> Войти
          </Button>
          {!isCheckoutPage && <CartBtn />}
        </div>
      </div>
    </header>
  );
};
