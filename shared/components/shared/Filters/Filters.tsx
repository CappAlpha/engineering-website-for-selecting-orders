"use client";

import { useRouter } from "next/navigation";
import qs from "qs";
import { useEffect, useState, type FC } from "react";

import { Button } from "@/components/ui/Button";
import { CheckboxFilterGroup } from "@/components/ui/CheckboxFilterGroup";
import { Input } from "@/components/ui/Input";
import { Slider } from "@/components/ui/Slider";
import { useDebouncedCallback } from "@/hook/useDebounce";
import { usePriceRange } from "@/hook/usePriceRange";
import { useTags } from "@/hook/useTags";

import s from "./Filters.module.scss";

const PRICE_CONFIG = {
  MIN_PRICE: 0,
  MAX_PRICE: 30000,
  SLIDER_GAP: 1000,
  SLIDER_STEP: 100,
} as const;

export const Filters: FC = () => {
  const router = useRouter();
  const [isReset, setIsReset] = useState(false);
  const {
    items: tags,
    selected: selectedTags,
    loading: loadingTags,
    error: errorTags,
    toggle: onAddTags,
    clear: onClearTags,
  } = useTags(setIsReset, true);
  const { prices, handlePriceChange, handleSliderChange } = usePriceRange(
    PRICE_CONFIG,
    {},
    setIsReset,
  );

  const actualPrice = isReset ? {} : prices;

  const updateUrl = useDebouncedCallback(
    (filters: { priceFrom?: number; priceTo?: number; tags: string[] }) => {
      const query = qs.stringify(filters, {
        arrayFormat: "comma",
        skipNulls: true,
      });
      router.push(`?${query}`, { scroll: false });
    },
    300,
  );

  useEffect(() => {
    const filters = {
      ...actualPrice,
      tags: Array.from(selectedTags),
    };

    updateUrl(filters);
  }, [isReset, prices, selectedTags, router]);

  // TODO: связать с кнопкой в ProductList
  const onClickResetFilters = () => {
    setIsReset(true);
    onClearTags();
    router.push("/", { scroll: false });
  };

  return (
    <div className={s.root}>
      <h2 className={s.subtitle}>Фильтрация</h2>

      <div className={s.priceCategory}>
        <p className={s.categoryTitle}>Цена от и до:</p>
        <div className={s.priceInputs}>
          <Input
            type="number"
            min={PRICE_CONFIG.MIN_PRICE}
            max={PRICE_CONFIG.MAX_PRICE - PRICE_CONFIG.SLIDER_GAP}
            value={actualPrice.priceFrom ?? PRICE_CONFIG.MIN_PRICE}
            onChange={(e) => handlePriceChange(e, "priceFrom")}
          />
          <Input
            type="number"
            min={PRICE_CONFIG.SLIDER_GAP}
            max={PRICE_CONFIG.MAX_PRICE}
            value={actualPrice.priceTo ?? PRICE_CONFIG.MAX_PRICE}
            onChange={(e) => handlePriceChange(e, "priceTo")}
          />
        </div>
        <Slider
          min={PRICE_CONFIG.MIN_PRICE}
          max={PRICE_CONFIG.MAX_PRICE}
          step={PRICE_CONFIG.SLIDER_STEP}
          minGap={PRICE_CONFIG.SLIDER_GAP}
          value={[
            actualPrice.priceFrom ?? PRICE_CONFIG.MIN_PRICE,
            actualPrice.priceTo ?? PRICE_CONFIG.MAX_PRICE / 2,
          ]}
          onValueChange={handleSliderChange}
        />
      </div>

      <CheckboxFilterGroup
        title="Категории"
        limit={5}
        items={tags}
        loading={loadingTags}
        error={errorTags}
        onClickCheckbox={onAddTags}
        selected={selectedTags}
      />

      <Button onClick={onClickResetFilters}>Сбросить фильтры</Button>
    </div>
  );
};
