"use client";

import { Slider as SliderMui } from "@mui/material";
import { useEffect, useState, type FC } from "react";

import { useDebouncedCallback } from "@/hook/useDebounce";

import s from "./Slider.module.scss";

export interface Props {
  min: number;
  max: number;
  value: number[];
  onValueChange: (value: number[]) => void;
  step?: number;
  minGap?: number;
}

export const Slider: FC<Props> = ({
  min,
  max,
  value,
  onValueChange,
  step = 1,
  minGap = step,
}) => {
  // Валидация начальных значений
  const initialValue =
    Array.isArray(value) && value.length === 2 && value[0] <= value[1]
      ? value
      : [min, max];

  const [localValues, setLocalValues] = useState<number[]>(initialValue);
  const debouncedOnValueChange = useDebouncedCallback(onValueChange, 150);

  // Синхронизация локального состояния при изменении пропсов
  useEffect(() => {
    const validValue =
      Array.isArray(value) && value.length === 2 && value[0] <= value[1]
        ? value
        : [min, max];
    setLocalValues(validValue);
  }, [min, max, value]);

  // Обработка изменения значений слайдера
  const handleValueChange = (
    _event: Event,
    newValues: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValues)) return;

    let adjustedValues: number[] = [...newValues];

    // Ограничение максимального значения
    adjustedValues[1] = Math.min(adjustedValues[1], max);

    // Обеспечение минимального зазора между ползунками
    if (adjustedValues[1] - adjustedValues[0] < minGap) {
      if (activeThumb === 0) {
        const leftValue = Math.min(
          adjustedValues[0],
          adjustedValues[1] - minGap,
        );
        adjustedValues = [leftValue, leftValue + minGap];
      } else {
        const rightValue = Math.max(
          adjustedValues[1],
          adjustedValues[0] + minGap,
        );
        adjustedValues = [rightValue - minGap, rightValue];
      }
    }

    // Ограничение минимального значения
    adjustedValues[0] = Math.max(min, adjustedValues[0]);
    adjustedValues[1] = Math.min(max, adjustedValues[1]);

    setLocalValues(adjustedValues);
    debouncedOnValueChange(adjustedValues);
  };

  const marks = [
    { value: min, label: min },
    { value: max, label: max },
  ];

  return (
    <SliderMui
      className={s.root}
      aria-label="Range slider"
      size="small"
      min={min}
      max={max}
      step={step}
      value={localValues}
      onChange={handleValueChange}
      marks={marks}
      sx={{
        margin: "10px 0",
        "& .MuiSlider-markLabel": {
          top: "30px",
          color: "white",
        },
      }}
      disableSwap
    />
  );
};
