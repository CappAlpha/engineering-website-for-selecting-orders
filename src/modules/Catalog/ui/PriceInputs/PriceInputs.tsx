import { ChangeEvent, type FC } from "react";

import { Input } from "@/shared/ui/Input";

import s from "./PriceInputs.module.scss";

interface Props {
  minPrice: number;
  maxPrice: number;
  priceFrom?: number;
  priceTo?: number;
  handlePriceChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "priceFrom" | "priceTo",
  ) => void;
}

export const PriceInputs: FC<Props> = ({
  minPrice,
  maxPrice,
  priceFrom,
  priceTo,
  handlePriceChange,
}) => {
  return (
    <div className={s.root}>
      <Input
        type="number"
        value={priceFrom ?? minPrice}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handlePriceChange(e, "priceFrom")
        }
        aria-label="Минимальная цена ввод клавиатурой"
        paddingSize="sm"
      />
      <Input
        type="number"
        value={priceTo ?? maxPrice}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handlePriceChange(e, "priceTo")
        }
        aria-label="Максимальная цена ввод клавиатурой"
        paddingSize="sm"
      />
    </div>
  );
};
