"use client";

import { Slider as SliderMui } from "@mui/material";
import { type FC } from "react";

import { useSliderChange } from "@/shared/hooks/useSliderChange";

import s from "./Slider.module.scss";

export interface SliderProps {
  min: number;
  max: number;
  value: number[];
  onValueChange: (value: number[]) => void;
  step?: number;
  minGap?: number;
}

export const Slider: FC<SliderProps> = ({
  min,
  max,
  value,
  onValueChange,
  step = 1,
  minGap = step,
}) => {
  const { localValues, handleValueChange } = useSliderChange({
    min,
    max,
    value,
    onValueChange,
    minGap,
  });

  const marks = [
    { value: min, label: String(min) },
    { value: max, label: String(max) },
  ];

  return (
    <SliderMui
      className={s.root}
      size="small"
      min={min}
      max={max}
      step={step}
      value={localValues}
      onChange={handleValueChange}
      marks={marks}
      disableSwap
    />
  );
};
