import { useDispatch } from "react-redux";

import { filtersActions } from "@/modules/Catalog/store/filtersSlice";
import { useAppSelector } from "@/shared/hook/useAppSelector";

interface PriceConfig {
  MIN_PRICE: number;
  MAX_PRICE: number;
  SLIDER_GAP: number;
  SLIDER_STEP: number;
}

export const usePriceRange = (config: PriceConfig) => {
  const dispatch = useDispatch();
  const prices = useAppSelector((state) => state.filters.prices);

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "priceFrom" | "priceTo",
  ) => {
    const value = Number(e.target.value);
    if (value >= config.MIN_PRICE && value <= config.MAX_PRICE) {
      dispatch(filtersActions.setPrices({ ...prices, [key]: value }));
    }
  };

  const handleSliderChange = (values: number[]) => {
    dispatch(
      filtersActions.setPrices({ priceFrom: values[0], priceTo: values[1] }),
    );
  };

  return { prices, handlePriceChange, handleSliderChange };
};
