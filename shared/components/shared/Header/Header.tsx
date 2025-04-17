import { Arrow, Settings, ShoppingCart, User } from "../../../../public/icon/";
import { SearchInput } from "@/components/shared/Header/SearchInput";
import { Button } from "@/components/ui/Button";
import s from "./Header.module.scss";
import { type FC } from "react";
import Link from "next/link";
import { prisma } from "../../../../prisma/prisma-client";

export const Header: FC = async () => {
  const categories = await prisma.category.findMany();

  return (
    <header className={s.root}>
      <div className={s.wrap}>
        <Link className={s.left} href={"/"}>
          <Settings className={s.engIcon} />
          <h2 className={s.title}>Engineer</h2>
        </Link>

        <SearchInput categories={categories} />

        <div className={s.right}>
          <Button>
            <User className={s.userIcon} /> Войти
          </Button>
          <Button className={s.cartBtn}>
            0 ₽ <span className={s.separator} />
            <ShoppingCart className={s.cartIcon} />{" "}
            <span className={s.count}>0</span>
            <Arrow className={s.arrowIcon} />
          </Button>
        </div>
      </div>
    </header>
  );
};
