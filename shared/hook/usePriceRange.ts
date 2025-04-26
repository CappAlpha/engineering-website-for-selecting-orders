import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectPrices } from "@/store/filters/filtersSelectors";
import { filtersActions } from "@/store/filters/filtersSlice";

interface PriceConfig {
  MIN_PRICE: number;
  MAX_PRICE: number;
  SLIDER_GAP: number;
  SLIDER_STEP: number;
}

export const usePriceRange = (config: PriceConfig) => {
  const dispatch = useDispatch();
  const prices = useSelector(selectPrices);

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, key: "priceFrom" | "priceTo") => {
      const value = Number(e.target.value);
      if (value >= config.MIN_PRICE && value <= config.MAX_PRICE) {
        dispatch(filtersActions.setPrices({ ...prices, [key]: value }));
      }
    },
    [config.MIN_PRICE, config.MAX_PRICE, dispatch, prices],
  );

  const handleSliderChange = useCallback(
    (values: number[]) => {
      dispatch(
        filtersActions.setPrices({ priceFrom: values[0], priceTo: values[1] }),
      );
    },
    [dispatch],
  );

  const reset = useCallback(() => {
    dispatch(filtersActions.resetPrices());
  }, [dispatch]);

  return { prices, handlePriceChange, handleSliderChange, reset };
};
