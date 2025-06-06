import { useEffect, useState } from "react";

import { SliderUtils } from "../lib/sliderUtils";
import { SliderProps } from "../ui/Slider";

type SliderRange = [number, number];
type ActiveThumb = 0 | 1;

export const useSliderChange = ({
  min,
  max,
  value,
  onValueChange,
  minGap,
}: SliderProps) => {
  const initialValue = SliderUtils.validateRange(value, min, max);

  const [localValues, setLocalValues] = useState<SliderRange>(initialValue);

  const handleValueChange = (
    _event: Event,
    newValues: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValues)) return;

    if (activeThumb !== 0 && activeThumb !== 1) return;

    const processedValues = SliderUtils.processValueChange(
      newValues,
      activeThumb as ActiveThumb,
      min,
      max,
      minGap ?? 0,
    );

    setLocalValues(processedValues);
    onValueChange(processedValues);
  };

  useEffect(() => {
    const validatedValue = SliderUtils.validateRange(value, min, max);

    if (
      validatedValue[0] !== localValues[0] ||
      validatedValue[1] !== localValues[1]
    ) {
      setLocalValues(validatedValue);
    }
  }, [min, max, value, localValues]);

  return { localValues, handleValueChange };
};
