import { type FC } from "react";

import s from "./ProductCard.module.scss";

interface Props {
  count?: number;
}

export const ProductCardsSkeleton: FC<Props> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div className={s.rootSkeleton} key={index}>
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
      ))}
    </>
  );
};
