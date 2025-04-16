"use client";
import { FilterCheckbox } from "../../ui/FilterCheckbox";
import { CheckboxFilterGroup } from "@/components/ui/CheckboxFilterGroup";
import { Slider } from "@/components/ui/Slider";
import { Input } from "@/components/ui/Input";
import s from "./Filters.module.scss";
import { useState, type FC } from "react";
import { useFilterTags } from "@/hook/useFilterTags";
export interface Props {
  //
}

export interface PriceProps {
  priceFrom: number;
  priceTo: number;
}

const MAX_PRICE = 60000;

export const Filters: FC<Props> = ({ }) => {
  const { items: tags, loading, onAddId, selectedIds } = useFilterTags();
  const [prices, setPrice] = useState<PriceProps>({ priceFrom: 0, priceTo: 5000 });

  const updatePrice = (name: keyof PriceProps, value: number) => {
    setPrice({ ...prices, [name]: value });
  };

  return (
    <div className={s.root}>
      <h2 className={s.subtitle}>Фильтрация</h2>

      <div className={s.specialCategories}>
        <FilterCheckbox name="Можно собирать" />
        <FilterCheckbox name="Новинки" />
      </div>

      <div className={s.priceCategory}>
        <p className={s.categoryTitle}>Цена от и до:</p>
        <div className={s.priceInputs}>
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={MAX_PRICE}
            value={String(prices.priceFrom)}
            onChange={(e) => updatePrice('priceFrom', Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="3000"
            min={100}
            max={MAX_PRICE}
            value={String(prices.priceTo)}
            onChange={(e) => updatePrice('priceTo', Number(e.target.value))}
          />
        </div>
        <Slider min={0} max={MAX_PRICE} step={100} value={[prices.priceFrom, prices.priceTo]} onValueChange={([priceFrom, priceTo]) => setPrice({ priceFrom, priceTo })} />
      </div>

      <CheckboxFilterGroup
        title="Категории"
        limit={5}
        items={tags}
        loading={loading}
        onClickCheckbox={onAddId}
        selectedIds={selectedIds}
      />
    </div>
  );
};
