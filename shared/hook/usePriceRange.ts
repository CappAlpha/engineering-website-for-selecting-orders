import { useState, ChangeEvent, useCallback } from "react";

interface PriceRange {
  priceFrom: number;
  priceTo: number;
}

interface PriceConfig {
  MAX_PRICE: number;
  MIN_PRICE: number;
  SLIDER_GAP: number;
}

export const usePriceRange = (
  initialPrices: PriceRange,
  config: PriceConfig,
) => {
  const [prices, setPrices] = useState<PriceRange>(initialPrices);

  // Валидация и нормализация цен
  const validateAndUpdatePrices = useCallback(
    (newPrice: number, field: keyof PriceRange): PriceRange => {
      const { MIN_PRICE, MAX_PRICE, SLIDER_GAP } = config;

      // Игнорируем некорректный ввод
      if (isNaN(newPrice) || newPrice < MIN_PRICE || newPrice > MAX_PRICE) {
        return prices;
      }

      let priceFrom = prices.priceFrom;
      let priceTo = prices.priceTo;

      if (field === "priceFrom") {
        priceFrom = Math.max(
          MIN_PRICE,
          Math.min(newPrice, MAX_PRICE - SLIDER_GAP),
        );
        priceTo = Math.max(
          priceTo,
          Math.min(priceFrom + SLIDER_GAP, MAX_PRICE),
        );
      } else {
        priceTo = Math.min(
          Math.max(newPrice, priceFrom + SLIDER_GAP),
          MAX_PRICE,
        );
        priceFrom = Math.min(priceFrom, priceTo - SLIDER_GAP);
      }

      return { priceFrom: Math.round(priceFrom), priceTo: Math.round(priceTo) };
    },
    [prices],
  );

  const handlePriceChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, field: keyof PriceRange) => {
      const value = Number(e.target.value);
      setPrices(validateAndUpdatePrices(value, field));
    },
    [validateAndUpdatePrices],
  );

  const handleSliderChange = useCallback((values: number[]) => {
    const [priceFrom, priceTo] = values;
    if (priceTo - priceFrom >= config.SLIDER_GAP) {
      setPrices({
        priceFrom: Math.round(priceFrom),
        priceTo: Math.round(priceTo),
      });
    }
  }, []);

  return {
    prices,
    handlePriceChange,
    handleSliderChange,
  };
};
