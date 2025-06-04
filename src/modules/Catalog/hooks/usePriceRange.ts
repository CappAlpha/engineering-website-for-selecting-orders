import { useDispatch } from "react-redux";

import { filtersActions } from "@/modules/Catalog/store/filtersSlice";
import { useGetPriceRangeQuery } from "@/shared/api/client/productsQuery";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { AppDispatch } from "@/store/store";

interface PriceConfig {
  SLIDER_GAP: number;
  SLIDER_STEP: number;
}

/**
 * usePriceRange is a custom hook that manages price range state and interactions.
 *
 * @param config An object containing configuration for the price slider, including SLIDER_GAP
 *               which defines the minimum gap between priceFrom and priceTo, and SLIDER_STEP
 *               which defines the step value for the slider.
 *
 * @returns An object containing:
 * - priceRange: The safe price range obtained from the server or default values.
 * - loading: A boolean indicating if the price range data is being loaded.
 * - error: Any error encountered while fetching the price range.
 * - prices: The current state of selected prices.
 * - handlePriceChange: A function to update the price based on input changes.
 * - handleSliderChange: A function to update the price based on slider changes.
 */
export const usePriceRange = (config: PriceConfig) => {
  const dispatch = useDispatch<AppDispatch>();
  const prices = useAppSelector((state) => state.filters.prices);

  const {
    data: priceRange = { minPrice: 0, maxPrice: 100000 },
    isLoading: loading,
    error,
  } = useGetPriceRangeQuery();

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "priceFrom" | "priceTo",
  ) => {
    const value = Number(e.target.value);
    const currentFrom = prices.priceFrom ?? priceRange.minPrice;
    const currentTo = prices.priceTo ?? priceRange.maxPrice;

    let newValue: number;

    if (key === "priceFrom") {
      newValue = Math.min(
        Math.max(value, priceRange.minPrice),
        currentTo - config.SLIDER_GAP,
      );
    } else {
      newValue = Math.max(
        Math.min(value, priceRange.maxPrice),
        currentFrom + config.SLIDER_GAP,
      );
    }

    dispatch(
      filtersActions.setPrices({
        ...prices,
        [key]: newValue,
      }),
    );
  };

  const handleSliderChange = (values: number[]) => {
    dispatch(
      filtersActions.setPrices({
        priceFrom: values[0],
        priceTo: values[1],
      }),
    );
  };

  return {
    priceRange,
    loading,
    error,
    prices,
    handlePriceChange,
    handleSliderChange,
  };
};
