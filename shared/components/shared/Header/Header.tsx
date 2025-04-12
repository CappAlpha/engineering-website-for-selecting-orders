import { Arrow, Settings, ShoppingCart, User } from "../../../../public/icon/";
import { Button } from "@/components/ui/Button";
import s from "./Header.module.scss";
import { type FC } from "react";

export interface Props {
  //
}

export const Header: FC<Props> = ({}) => {
  return (
    <header className={s.root}>
      <div className={s.wrap}>
        <div className={s.left}>
          <Settings className={s.engIcon} />
          <h2 className={s.title}>Engineer</h2>
        </div>

        <input className={s.search} type="search" placeholder="Поиск" />

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
