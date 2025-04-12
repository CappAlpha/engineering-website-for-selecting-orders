"use client";
import { Slider as SliderMui } from "@mui/material";
import s from "./Slider.module.scss";
import { type FC } from "react";

export interface Props {
  min: number;
  max: number;
  defaultValue?: number;
  step?: number;
}

export const Slider: FC<Props> = ({ min, max, defaultValue, step }) => {
  return (
    <SliderMui
      className={s.root}
      aria-label="Always visible"
      size="small"
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      marks={[
        {
          value: min,
          label: min,
        },
        {
          value: max,
          label: max,
        },
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
