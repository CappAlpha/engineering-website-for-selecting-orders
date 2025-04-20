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
  const initialValue =
    Array.isArray(value) && value.length === 2 ? value : [min, max];
  const [localValues, setLocalValues] = useState<number[]>(initialValue);
  const debouncedOnValueChange = useDebouncedCallback(onValueChange, 100);

  useEffect(() => {
    const validValue =
      Array.isArray(value) && value.length === 2 ? value : [min, max];
    setLocalValues(validValue);
  }, [min, max, value]);

  const handleValueChange = (
    _event: Event,
    newValues: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValues)) return;

    let adjustedValues: number[] = [...newValues];

    adjustedValues[1] = Math.min(adjustedValues[1], max);

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
      marks={[
        { value: min, label: min },
        { value: max, label: max },
      ]}
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
