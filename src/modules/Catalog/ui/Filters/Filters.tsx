"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, type FC } from "react";

import { useResetFilters } from "@/modules/Catalog/actions/useResetFilters";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Slider } from "@/shared/ui/Slider";

import { usePriceRange } from "../../actions/usePriceRange";
import { useQueryFilters } from "../../actions/useQueryFilters";
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

  // Set filters in url
  useQueryFilters(router, priceFrom, priceTo, selectedTags);

  return (
    <section className={s.root} aria-label="Фильтр продуктов">
      <h2 className={s.subtitle}>Фильтрация</h2>

      <div className={s.priceCategory}>
        <p className={s.categoryTitle}>Цена от и до:</p>
        <div className={s.priceInputs}>
          <Input
            id="left-input-price"
            type="number"
            value={priceFrom ?? PRICE_CONFIG.MIN_PRICE}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handlePriceChange(e, "priceFrom")
            }
            aria-label="Минимальная цена ввод клавиатурой"
          />
          <Input
            id="right-input-price"
            type="number"
            value={priceTo ?? PRICE_CONFIG.MAX_PRICE}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handlePriceChange(e, "priceTo")
            }
            aria-label="Максимальная цена ввод клавиатурой"
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
          aria-label="Диапазон цен можно двигать два ползунка влево или вправо"
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
