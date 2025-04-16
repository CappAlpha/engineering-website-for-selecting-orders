"use client";
import { Slider as SliderMui } from "@mui/material";
import s from "./Slider.module.scss";
import { useEffect, useState, type FC } from "react";
import { useDebouncedCallback } from "@/hook/useDebounce";

export interface Props {
  min: number;
  max: number;
  value: number[];
  onValueChange: (value: number[]) => void;
  step?: number;
}

export const Slider: FC<Props> = ({ min, max, value, onValueChange, step = 1 }) => {
  const initialValue = Array.isArray(value) && value.length === 2 ? value : [min, max];
  const [localValues, setLocalValues] = useState<number[]>(initialValue);
  const debouncedOnValueChange = useDebouncedCallback(onValueChange, 100);

  useEffect(() => {
    const validValue = Array.isArray(value) && value.length === 2 ? value : [min, max];
    setLocalValues(validValue);
  }, [min, max, value]);

  const handleValueChange = (_event: Event, newValues: number | number[], _activeThumb: number) => {
    if (!Array.isArray(newValues)) return;
    setLocalValues(newValues);
    debouncedOnValueChange(newValues);
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
    />
  );
};