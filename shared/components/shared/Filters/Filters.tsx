import { type FC } from 'react';

import { FilterCheckbox, Props as FilterCheckboxProps } from '../../ui/FilterCheckbox';
import { Input } from '@/components/ui/Input';
import { CheckboxFilterGroup } from '@/components/ui/CheckboxFilterGroup';

import s from './Filters.module.scss';
import { Slider } from '@/components/ui/Slider';

export interface Props {
  //
}

const CHECKBOXES_DATA: FilterCheckboxProps[] = [
  {
    text: 'Чертежи',
    value: '1'
  },
  {
    text: 'Мосты',
    value: '2'
  },
  {
    text: 'Здания',
    value: '3'
  },
  {
    text: 'Задачи',
    value: '4'
  },
  {
    text: 'Сопромат',
    value: '5'
  },
  {
    text: 'Программы на С++',
    value: '6'
  },
  {
    text: '123',
    value: '7'
  },
];

export const Filters: FC<Props> = ({ }) => {
  return (
    <div className={s.root}>
      <h2 className={s.subtitle}>Фильтрация</h2>

      <div className={s.specialCategories}>
        <FilterCheckbox text='Можно собирать' value='' />
        <FilterCheckbox text='Новинки' value='' />
      </div>

      <div className={s.priceCategory}>
        <p className={s.categoryTitle}>Цена от и до:</p>
        <div className={s.priceInputs}>
          <Input type='number' placeholder="0" min={0} max={30000} defaultValue={0} />
          <Input type='number' placeholder="3000" min={100} max={30000} defaultValue={30000} />
        </div>
        <Slider
          min={0}
          max={5000}
          defaultValue={5000}
          step={10}
        />
      </div>

      <CheckboxFilterGroup
        title="Категории"
        limit={6}
        items={CHECKBOXES_DATA}
      />
    </div>
  );
};