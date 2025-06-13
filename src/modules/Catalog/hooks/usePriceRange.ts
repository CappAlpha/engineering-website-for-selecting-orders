import { ChangeEvent, useCallback } from "react";
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
  const priceFrom = useAppSelector((state) => state.filters.prices.priceFrom);
  const priceTo = useAppSelector((state) => state.filters.prices.priceTo);

  const {
    data: priceRange = { minPrice: 0, maxPrice: 100000 },
    isLoading: loading,
    error,
  } = useGetPriceRangeQuery();

  const safePrices = {
    priceFrom: priceFrom ?? priceRange.minPrice,
    priceTo: priceTo ?? priceRange.maxPrice,
  };

  const validatePriceValue = useCallback(
    (
      value: number,
      key: "priceFrom" | "priceTo",
      currentPrices: { priceFrom: number; priceTo: number },
    ): number => {
      if (isNaN(value) || value < 0) {
        return key === "priceFrom" ? priceRange.minPrice : priceRange.maxPrice;
      }

      if (key === "priceFrom") {
        const maxAllowed = Math.max(
          priceRange.minPrice,
          currentPrices.priceTo - config.SLIDER_GAP,
        );
        return Math.min(Math.max(value, priceRange.minPrice), maxAllowed);
      } else {
        const minAllowed = Math.min(
          priceRange.maxPrice,
          currentPrices.priceFrom + config.SLIDER_GAP,
        );
        return Math.max(Math.min(value, priceRange.maxPrice), minAllowed);
      }
    },
    [config.SLIDER_GAP, priceRange.minPrice, priceRange.maxPrice],
  );

  const handlePriceChange = (
    e: ChangeEvent<HTMLInputElement>,
    key: "priceFrom" | "priceTo",
  ) => {
    const inputValue = e.target.value;

    if (inputValue === "") {
      dispatch(
        filtersActions.setPrices({
          priceFrom,
          priceTo,
          [key]: null,
        }),
      );
      return;
    }

    const numericValue = Number(inputValue);

    if (isNaN(numericValue)) {
      return;
    }

    dispatch(
      filtersActions.setPrices({
        priceFrom,
        priceTo,
        [key]: numericValue,
      }),
    );
  };

  const handlePriceBlur = (key: "priceFrom" | "priceTo") => {
    const currentValue = key === "priceFrom" ? priceFrom : priceTo;

    if (currentValue === null || currentValue === undefined) {
      const defaultValue =
        key === "priceFrom" ? priceRange.minPrice : priceRange.maxPrice;
      dispatch(
        filtersActions.setPrices({
          priceFrom,
          priceTo,
          [key]: defaultValue,
        }),
      );
      return;
    }

    const validatedValue = validatePriceValue(currentValue, key, safePrices);

    if (validatedValue !== currentValue) {
      dispatch(
        filtersActions.setPrices({
          priceFrom,
          priceTo,
          [key]: validatedValue,
        }),
      );
    }
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
    priceFrom,
    priceTo,
    handlePriceChange,
    handlePriceBlur,
    handleSliderChange,
  };
};
