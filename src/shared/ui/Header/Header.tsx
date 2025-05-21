import Link from "next/link";
import { Suspense, type FC } from "react";

import { CartBtn } from "@/modules/Cart/ui/CartBtn";

import { prisma } from "../../../../prisma/prisma-client";
import { Settings } from "../../../../public/icon";
import { Auth } from "../../../modules/Auth/ui/Auth";
import { Button } from "../Button";
import { HeaderScroll } from "./HeaderScroll";
import { SearchInput } from "./SearchInput";

import s from "./Header.module.scss";

interface Props {
  isCheckoutPage?: boolean;
  isCatalogPage?: boolean;
}

export const Header: FC<Props> = async ({
  isCheckoutPage = false,
  isCatalogPage = false,
}) => {
  const categories = await prisma.category.findMany();

  return (
    <HeaderScroll isCatalogPage={isCatalogPage}>
      <header className={s.root}>
        <div className={s.wrap}>
          <Link className={s.left} href="/">
            <Settings className={s.engIcon} />
            <h2 className={s.title}>Engineer</h2>
          </Link>

          {!isCheckoutPage && (
            <SearchInput categories={categories} className={s.searchInput} />
          )}

          <div className={s.right}>
            {/* TODO: add loading? */}
            <Suspense fallback={<Button loading></Button>}>
              <Auth />
            </Suspense>
            {!isCheckoutPage && <CartBtn />}
          </div>
        </div>
      </header>
    </HeaderScroll>
  );
};
