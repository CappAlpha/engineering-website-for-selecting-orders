"use client";

import { useRouter } from "next/navigation";
import qs from "qs";
import { useEffect, type FC } from "react";

import { CheckboxFilterGroup } from "@/components/shared/Filters/CheckboxFilterGroup";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Slider } from "@/components/ui/Slider";
import { useDebouncedCallback } from "@/hook/useDebounce";
import { usePriceRange } from "@/hook/usePriceRange";
import { useResetFilters } from "@/hook/useResetFilters";
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
  const { resetFilters } = useResetFilters(router);

  const {
    items: tags,
    selected: selectedTags,
    loading: loadingTags,
    error: errorTags,
    toggle: onAddTags,
  } = useTags(true);

  const {
    prices: { priceFrom, priceTo },
    handlePriceChange,
    handleSliderChange,
  } = usePriceRange(PRICE_CONFIG);

  // Update URL when filter changes
  useEffect(() => {
    const filters = {
      priceFrom: priceFrom,
      priceTo: priceTo,
      tags: selectedTags,
    };
    updateUrl(filters);
  }, [priceFrom, priceTo, selectedTags]);

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
            value={priceFrom ?? PRICE_CONFIG.MIN_PRICE}
            onChange={(e) => handlePriceChange(e, "priceFrom")}
          />
          <Input
            type="number"
            min={PRICE_CONFIG.SLIDER_GAP}
            max={PRICE_CONFIG.MAX_PRICE}
            value={priceTo ?? PRICE_CONFIG.MAX_PRICE}
            onChange={(e) => handlePriceChange(e, "priceTo")}
          />
        </div>
        <Slider
          min={PRICE_CONFIG.MIN_PRICE}
          max={PRICE_CONFIG.MAX_PRICE}
          step={PRICE_CONFIG.SLIDER_STEP}
          minGap={PRICE_CONFIG.SLIDER_GAP}
          value={[
            priceFrom ?? PRICE_CONFIG.MIN_PRICE,
            priceTo ?? PRICE_CONFIG.MAX_PRICE,
          ]}
          onValueChange={handleSliderChange}
        />
      </div>

      <CheckboxFilterGroup
        title="Категории"
        items={tags}
        selected={selectedTags}
        loading={loadingTags}
        error={errorTags}
        onClickCheckbox={onAddTags}
        resetFilters={resetFilters}
      />

      <Button onClick={resetFilters}>Сбросить фильтры</Button>
    </div>
  );
};
