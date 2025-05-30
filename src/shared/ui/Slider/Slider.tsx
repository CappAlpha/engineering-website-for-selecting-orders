"use client";

import { Slider as SliderMui } from "@mui/material";
import { useEffect, useState, type FC } from "react";

import { useDebouncedCallback } from "@/shared/hooks/useDebounce";

import s from "./Slider.module.scss";

interface Props {
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
  // Validation
  const initialValue =
    Array.isArray(value) && value.length === 2 && value[0] <= value[1]
      ? value
      : [min, max];

  const [localValues, setLocalValues] = useState<number[]>(initialValue);
  const debouncedOnValueChange = useDebouncedCallback(onValueChange, 150);

  // Synchronize local state when props changed
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

    adjustedValues[1] = Math.min(adjustedValues[1], max);

    // Keep gap between sliders
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
        "& .MuiSlider-markLabel": {
          color: "white",
        },
      }}
      disableSwap
    />
  );
};
