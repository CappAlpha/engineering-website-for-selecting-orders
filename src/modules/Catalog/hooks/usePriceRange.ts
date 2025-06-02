import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  fetchPriceRange,
  filtersActions,
} from "@/modules/Catalog/store/filtersSlice";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { AppDispatch } from "@/store/store";

interface PriceConfig {
  SLIDER_GAP: number;
  SLIDER_STEP: number;
}

/**
 * usePriceRange hook for managing price range in filters state.
 *
 * @param config - price range configuration
 * @returns an object with the following properties:
 *  - prices: current price range
 *  - handlePriceChange: function to update price range when input values change
 *  - handleSliderChange: function to update price range when slider values change
 */
export const usePriceRange = (config: PriceConfig) => {
  const dispatch = useDispatch<AppDispatch>();
  const priceRange = useAppSelector((state) => state.filters.priceRange);
  const prices = useAppSelector((state) => state.filters.prices);
  const { loading, error } = useAppSelector((state) => state.filters);

  // TODO: improve?
  useEffect(() => {
    dispatch(fetchPriceRange());
  }, [dispatch]);

  /**
   * Updates the price range in the filters state based on input field changes.
   *
   * @param e - The change event from the input field.
   * @param key - Specifies which price value to update ("priceFrom" or "priceTo").
   */
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
        Math.min(value, priceRange.minPrice),
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

  /**
   * Updates the price range in the filters state based on slider changes.
   *
   * @param values - Array containing the new "priceFrom" and "priceTo" values.
   */
  const handleSliderChange = (values: number[]) => {
    dispatch(
      filtersActions.setPrices({ priceFrom: values[0], priceTo: values[1] }),
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
