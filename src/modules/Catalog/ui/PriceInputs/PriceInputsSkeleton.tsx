import { type FC } from "react";

import s from "./PriceInputs.module.scss";

export const PriceInputsSkeleton: FC = () => {
  return (
    <div className={s.priceInputsSkeleton}>
      <div className={s.priceInputSkeleton} />
      <div className={s.priceInputSkeleton} />
    </div>
  );
};
