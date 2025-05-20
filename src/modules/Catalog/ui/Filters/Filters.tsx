"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useState, type FC } from "react";

import { useResetFilters } from "@/modules/Catalog/services/useResetFilters";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Slider } from "@/shared/ui/Slider";

import { usePriceRange } from "../../services/usePriceRange";
import { useQueryFilters } from "../../services/useQueryFilters";
import { useTags } from "../../services/useTags";
import { FilterTags } from "../FilterTags";

import s from "./Filters.module.scss";

const PRICE_CONFIG = {
  MIN_PRICE: 0,
  MAX_PRICE: 30000,
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
    prices: { priceFrom, priceTo },
    handlePriceChange,
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
        <div className={s.priceInputs}>
          <Input
            type="number"
            value={priceFrom ?? PRICE_CONFIG.MIN_PRICE}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handlePriceChange(e, "priceFrom")
            }
            aria-label="Минимальная цена ввод клавиатурой"
          />
          <Input
            type="number"
            value={priceTo ?? PRICE_CONFIG.MAX_PRICE}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handlePriceChange(e, "priceTo")
            }
            aria-label="Максимальная цена ввод клавиатурой"
          />
        </div>
        <div className={s.sliderWrap}>
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
            aria-label="Диапазон цен можно двигать два ползунка влево или вправо"
          />
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
