import Link from "next/link";
import { Suspense, type FC } from "react";

import { CartBtn } from "@/modules/Cart/ui/CartBtn";

import { prisma } from "../../../../prisma/prisma-client";
import { Settings } from "../../../../public/icon";
import { Auth } from "../../../modules/Auth/ui/Auth";
import { Search } from "../Search";
import { HeaderScroll } from "./HeaderScroll";

import s from "./Header.module.scss";

interface Props {
  isCheckoutPage?: boolean;
  isCatalogPage?: boolean;
}

export const Header: FC<Props> = async ({
  isCheckoutPage = false,
  isCatalogPage = false,
}) => {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
    },
  });

  const headerRender = (
    <header className={s.root}>
      <div className={s.wrap}>
        <Link className={s.left} href="/">
          <Settings className={s.engIcon} />
          <h2 className={s.title}>Engineer</h2>
        </Link>

        {!isCheckoutPage && (
          <Search categories={categories} className={s.searchInput} />
        )}

        <div className={s.right}>
          <Suspense>
            <Auth />
          </Suspense>
          {!isCheckoutPage && <CartBtn />}
        </div>
      </div>
    </header>
  );

  return (
    <>
      {isCatalogPage ? (
        <HeaderScroll>{headerRender}</HeaderScroll>
      ) : (
        headerRender
      )}
    </>
  );
};
