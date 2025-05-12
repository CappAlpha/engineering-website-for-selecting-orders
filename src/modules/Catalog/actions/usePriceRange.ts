import { useDispatch } from "react-redux";

import { filtersActions } from "@/modules/Catalog/store/filtersSlice";
import { useAppSelector } from "@/shared/hook/useAppSelector";

interface PriceConfig {
  MIN_PRICE: number;
  MAX_PRICE: number;
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
  const dispatch = useDispatch();
  const prices = useAppSelector((state) => state.filters.prices);

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
    let newPriceFrom = prices.priceFrom ?? config.MIN_PRICE;
    let newPriceTo = prices.priceTo ?? config.MAX_PRICE;

    if (key === "priceFrom") {
      newPriceFrom = Math.max(
        Math.min(
          value,
          config.MAX_PRICE - config.SLIDER_GAP,
          newPriceTo !== null ? newPriceTo - config.SLIDER_GAP : Infinity,
        ),
        config.MIN_PRICE,
      );
    } else {
      newPriceTo = Math.min(
        Math.max(
          value,
          config.MIN_PRICE + config.SLIDER_GAP,
          newPriceFrom !== null ? newPriceFrom + config.SLIDER_GAP : -Infinity,
        ),
        config.MAX_PRICE,
      );
    }

    dispatch(
      filtersActions.setPrices({
        priceFrom: newPriceFrom,
        priceTo: newPriceTo,
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

  return { prices, handlePriceChange, handleSliderChange };
};
