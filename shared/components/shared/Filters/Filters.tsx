"use client";
import { CheckboxFilterGroup } from "@/components/ui/CheckboxFilterGroup";
import { Slider } from "@/components/ui/Slider";
import { Input } from "@/components/ui/Input";
import s from "./Filters.module.scss";
import { type FC } from "react";
import { useFilterTags } from "@/hook/useFilterTags";
import { usePriceRange } from "@/hook/usePriceRange";

interface FiltersProps { }

const PRICE_CONFIG = {
  MIN_PRICE: 0,
  MAX_PRICE: 30000,
  PRICE_TO: 15000,
  SLIDER_GAP: 1000,
  SLIDER_STEP: 100,
} as const;

export const Filters: FC<FiltersProps> = () => {
  const { items: tags, loading, onAdd, selected } = useFilterTags();
  const { prices, handlePriceChange, handleSliderChange } = usePriceRange({ priceFrom: PRICE_CONFIG.MIN_PRICE, priceTo: PRICE_CONFIG.PRICE_TO }, PRICE_CONFIG);

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
            value={prices.priceFrom}
            onChange={(e) => handlePriceChange(e, "priceFrom")}
          />
          <Input
            type="number"
            min={PRICE_CONFIG.SLIDER_GAP}
            max={PRICE_CONFIG.MAX_PRICE}
            value={prices.priceTo}
            onChange={(e) => handlePriceChange(e, "priceTo")}
          />
        </div>
        <Slider
          min={PRICE_CONFIG.MIN_PRICE}
          max={PRICE_CONFIG.MAX_PRICE}
          step={PRICE_CONFIG.SLIDER_STEP}
          minGap={PRICE_CONFIG.SLIDER_GAP}
          value={[prices.priceFrom, prices.priceTo]}
          onValueChange={handleSliderChange}
        />
      </div>

      <CheckboxFilterGroup
        title="Категории"
        limit={5}
        items={tags}
        loading={loading}
        onClickCheckbox={onAdd}
        selected={selected}
      />
    </div>
  );
};