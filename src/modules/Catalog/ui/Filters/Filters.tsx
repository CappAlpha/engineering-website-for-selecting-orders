"use client";

import { useRouter } from "next/navigation";
import { useState, type FC } from "react";

import { useResetFilters } from "@/modules/Catalog/hooks/useResetFilters";
import { Button } from "@/shared/ui/Button";
import { Slider } from "@/shared/ui/Slider";

import { usePriceRange } from "../../hooks/usePriceRange";
import { useQueryFilters } from "../../hooks/useQueryFilters";
import { useTags } from "../../hooks/useTags";
import { FilterTags } from "../FilterTags";
import { PriceInputs } from "../PriceInputs";
import { PriceInputsSkeleton } from "../PriceInputs/PriceInputsSkeleton";

import s from "./Filters.module.scss";

const PRICE_CONFIG = {
  SLIDER_GAP: 1000,
  SLIDER_STEP: 100,
} as const;

export const Filters: FC = () => {
  const router = useRouter();
  const [searchTagsValue, setSearchTagsValue] = useState("");

  const { resetFilters } = useResetFilters();

  const {
    tags,
    selected: selectedTags,
    loading: loadingTags,
    error: errorTags,
    toggle: onAddTags,
  } = useTags(true);

  const {
    priceRange: { minPrice, maxPrice },
    loading: loadingPrice,
    priceFrom,
    priceTo,
    handlePriceChange,
    handlePriceBlur,
    handleSliderChange,
  } = usePriceRange(PRICE_CONFIG);

  // Set filters in url
  useQueryFilters(router, priceFrom, priceTo, selectedTags);

  // Resets all filters and sets search tags input value to empty string
  const onClickReset = () => {
    resetFilters();
    setSearchTagsValue("");
  };

  return (
    <div className={s.root} aria-label="Фильтр продуктов">
      <h3 className={s.subtitle}>Фильтрация</h3>

      <div className={s.priceCategory}>
        <p className={s.categoryTitle}>Цена от и до:</p>
        {loadingPrice ? (
          <PriceInputsSkeleton />
        ) : (
          <PriceInputs
            minPrice={minPrice}
            maxPrice={maxPrice}
            priceFrom={priceFrom}
            priceTo={priceTo}
            handlePriceChange={handlePriceChange}
            handlePriceBlur={handlePriceBlur}
          />
        )}
        <div className={s.sliderWrap}>
          {loadingPrice ? (
            <div className={s.sliderSkeleton} />
          ) : (
            <Slider
              min={minPrice}
              max={maxPrice}
              step={PRICE_CONFIG.SLIDER_STEP}
              minGap={PRICE_CONFIG.SLIDER_GAP}
              value={[priceFrom ?? minPrice, priceTo ?? maxPrice]}
              onValueChange={handleSliderChange}
              aria-label="Диапазон цен. Можно двигать два ползунка влево или вправо"
            />
          )}
        </div>
      </div>

      <FilterTags
        title="Категории"
        items={tags}
        searchValue={searchTagsValue}
        selected={selectedTags}
        loading={loadingTags}
        error={errorTags}
        onClickCheckbox={onAddTags}
        resetFilters={onClickReset}
        setSearchValue={setSearchTagsValue}
      />

      <Button onClick={onClickReset} aria-label="Кнопка сброса фильтров">
        Сбросить фильтры
      </Button>
    </div>
  );
};
