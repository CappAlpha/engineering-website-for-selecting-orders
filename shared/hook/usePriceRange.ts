import { useState, ChangeEvent, useCallback } from "react";

// Интерфейсы
interface PriceRange {
  priceFrom?: number;
  priceTo?: number;
}

interface PriceConfig {
  MAX_PRICE: number;
  MIN_PRICE: number;
  SLIDER_GAP: number;
}

// Хук
export const usePriceRange = (
  initialPrices: PriceRange,
  config: PriceConfig,
) => {
  const [prices, setPrices] = useState<PriceRange>(initialPrices);

  // Валидация и обновление цен
  const validateAndUpdatePrices = useCallback(
    (newPrice: number, field: keyof PriceRange): PriceRange => {
      const { MIN_PRICE, MAX_PRICE, SLIDER_GAP } = config;
      const currentPrices = prices;

      if (isNaN(newPrice)) {
        return currentPrices; // Игнорируем нечисловой ввод
      }

      let priceFrom = currentPrices.priceFrom ?? MIN_PRICE;
      let priceTo = currentPrices.priceTo ?? MAX_PRICE / 2;

      if (field === "priceFrom") {
        // Ограничиваем priceFrom: от minPrice до MAX_PRICE - SLIDER_GAP
        priceFrom = Math.max(MIN_PRICE, Math.min(newPrice, MAX_PRICE - SLIDER_GAP));
        // Корректируем priceTo, если нарушен минимальный зазор
        priceTo = Math.max(priceTo, Math.min(priceFrom + SLIDER_GAP, MAX_PRICE));
      } else {
        // Ограничиваем priceTo: от priceFrom + SLIDER_GAP до MAX_PRICE
        priceTo = Math.min(
          Math.max(newPrice, priceFrom + SLIDER_GAP),
          MAX_PRICE,
        );
        // Корректируем priceFrom, если нарушен минимальный зазор
        priceFrom = Math.min(priceFrom, priceTo - SLIDER_GAP);
      }

      return { priceFrom, priceTo };
    },
    [prices, config],
  );

  // Обработчик изменения инпута
  const handlePriceChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, field: keyof PriceRange) => {
      const value = Number(e.target.value);
      setPrices(validateAndUpdatePrices(value, field));
    },
    [validateAndUpdatePrices],
  );

  // Обработчик изменения слайдера
  const handleSliderChange = useCallback(
    ([priceFrom, priceTo]: number[]) => {
      setPrices({ priceFrom, priceTo });
    },
    [],
  );

  return {
    prices,
    handlePriceChange,
    handleSliderChange,
  };
};