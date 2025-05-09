import { type FC } from "react";

import s from "./ProductCardLine.module.scss";

export const ProductCardLineSkeleton: FC = () => {
  return (
    <div className={s.rootSkeleton}>
      <div className={s.imgWrapSkeleton} />

      <div className={s.contentWrapSkeleton}>
        <div className={s.titleSkeleton} />
        <div className={s.descriptionSkeleton} />
        <div className={s.descriptionLineSkeleton} />
        <div className={s.bottomSkeleton}>
          <div className={s.btnsSkeleton} />
          <div className={s.bottomRightSkeleton} />
        </div>
      </div>
    </div>
  );
};
