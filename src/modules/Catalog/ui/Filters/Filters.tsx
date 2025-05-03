"use client";

import { useRouter } from "next/navigation";
import qs from "qs";
import { useEffect, type FC } from "react";

import { useResetFilters } from "@/modules/Catalog/actions/useResetFilters";
import { useDebouncedCallback } from "@/shared/hook/useDebounce";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Slider } from "@/shared/ui/Slider";

import { usePriceRange } from "../../actions/usePriceRange";
import { useTags } from "../../actions/useTags";
import { CheckboxFilterGroup } from "../CheckboxFilterGroup";

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
    tags,
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
    updateUrl({ priceFrom, priceTo, tags: selectedTags });
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
    <section className={s.root} aria-label="Фильтр продуктов">
      <h2 className={s.subtitle}>Фильтрация</h2>

      <div className={s.priceCategory}>
        <p className={s.categoryTitle}>Цена от и до:</p>
        <div className={s.priceInputs}>
          <Input
            id="left-input-price"
            type="number"
            min={PRICE_CONFIG.MIN_PRICE}
            max={
              priceTo
                ? priceTo - PRICE_CONFIG.SLIDER_GAP
                : PRICE_CONFIG.MAX_PRICE - PRICE_CONFIG.SLIDER_GAP
            }
            value={priceFrom ?? PRICE_CONFIG.MIN_PRICE}
            onChange={(e) => handlePriceChange(e, "priceFrom")}
            aria-label="Минимальная цена ввод"
          />
          <Input
            id="right-input-price"
            type="number"
            min={
              priceFrom
                ? priceFrom + PRICE_CONFIG.SLIDER_GAP
                : PRICE_CONFIG.MIN_PRICE
            }
            max={PRICE_CONFIG.MAX_PRICE}
            value={priceTo ?? PRICE_CONFIG.MAX_PRICE}
            onChange={(e) => handlePriceChange(e, "priceTo")}
            aria-label="Максимальная цена ввод"
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
          aria-label="Диапазон цен можно двигать два ползунка налево или направо"
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

      <Button onClick={resetFilters} aria-label="Кнопка сброса фильтров">
        Сбросить фильтры
      </Button>
    </section>
  );
};
