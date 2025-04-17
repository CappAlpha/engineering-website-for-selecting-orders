"use client";
import { CheckboxFilterGroup } from "@/components/ui/CheckboxFilterGroup";
import { usePriceRange } from "@/hook/usePriceRange";
import { useTags } from "@/hook/useTags";
import { Slider } from "@/components/ui/Slider";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useEffect, type FC } from "react";
import s from "./Filters.module.scss";
import qs from "qs";

const PRICE_CONFIG = {
  MIN_PRICE: 0,
  MAX_PRICE: 30000,
  PRICE_TO: 15000,
  SLIDER_GAP: 1000,
  SLIDER_STEP: 100,
} as const;

export const Filters: FC = () => {
  const router = useRouter();
  const {
    items: tags,
    loading: loadingTags,
    onAdd: onAddTags,
    selected: selectedTags,
  } = useTags();
  const { prices, handlePriceChange, handleSliderChange } = usePriceRange(
    {},
    PRICE_CONFIG,
  );

  useEffect(() => {
    const filters = {
      ...prices,
      tags: Array.from(selectedTags),
    };

    const query = qs.stringify(filters, {
      arrayFormat: "comma",
    });

    router.push(`?${query}`, { scroll: false });
  }, [prices, selectedTags, router]);

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
            value={prices.priceFrom ?? PRICE_CONFIG.MIN_PRICE}
            onChange={(e) => handlePriceChange(e, "priceFrom")}
          />
          <Input
            type="number"
            min={PRICE_CONFIG.SLIDER_GAP}
            max={PRICE_CONFIG.MAX_PRICE}
            value={prices.priceTo ?? PRICE_CONFIG.MAX_PRICE / 2}
            onChange={(e) => handlePriceChange(e, "priceTo")}
          />
        </div>
        <Slider
          min={PRICE_CONFIG.MIN_PRICE}
          max={PRICE_CONFIG.MAX_PRICE}
          step={PRICE_CONFIG.SLIDER_STEP}
          minGap={PRICE_CONFIG.SLIDER_GAP}
          value={[
            prices.priceFrom ?? PRICE_CONFIG.MIN_PRICE,
            prices.priceTo ?? PRICE_CONFIG.MAX_PRICE / 2,
          ]}
          onValueChange={handleSliderChange}
        />
      </div>

      {/* TODO: чекбоксы выбранные попадали вверх списка */}
      <CheckboxFilterGroup
        title="Категории"
        limit={5}
        items={tags}
        loading={loadingTags}
        onClickCheckbox={onAddTags}
        selected={selectedTags}
      />
    </div>
  );
};
