import { type FC } from "react";

import s from "./ProductCard.module.scss";

export const ProductCardSkeleton: FC = () => {
  return (
    <div className={s.rootSkeleton}>
      <div className={s.imgWrapSkeleton} />
      <div className={s.textWrap}>
        <div className={s.titleSkeleton} />
        <div className={s.descriptionSkeleton} />
      </div>
      <div className={s.bottom}>
        <div className={s.tagsSkeleton} />
        <div className={s.bottomWrap}>
          <div className={s.priceSkeleton} />
          <div className={s.buttonSkeleton} />
        </div>
      </div>
    </div>
  );
};
