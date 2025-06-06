export type SliderRange = [number, number];
export type ActiveThumb = 0 | 1;

export class SliderUtils {
  static validateRange(value: unknown, min: number, max: number): SliderRange {
    if (!Array.isArray(value)) {
      return [min, max];
    }

    const [left, right] = value;

    if (!Number.isFinite(left) || !Number.isFinite(right)) {
      return [min, max] as const;
    }

    const sortedValues = [left, right].sort((a, b) => a - b);

    return [
      Math.max(min, Math.min(sortedValues[0], max)),
      Math.max(min, Math.min(sortedValues[1], max)),
    ] as const;
  }

  static applyMinGap(
    values: SliderRange,
    minGap: number,
    activeThumb: ActiveThumb,
    min: number,
    max: number,
  ): SliderRange {
    const [leftValue, rightValue] = values;
    const currentGap = rightValue - leftValue;

    if (currentGap >= minGap) {
      return values;
    }

    if (activeThumb === 0) {
      const newLeftValue = Math.min(leftValue, rightValue - minGap);
      const adjustedLeftValue = Math.max(min, newLeftValue);
      const adjustedRightValue = Math.min(max, adjustedLeftValue + minGap);

      return [adjustedLeftValue, adjustedRightValue];
    } else {
      const newRightValue = Math.max(rightValue, leftValue + minGap);
      const adjustedRightValue = Math.min(max, newRightValue);
      const adjustedLeftValue = Math.max(min, adjustedRightValue - minGap);

      return [adjustedLeftValue, adjustedRightValue];
    }
  }

  static processValueChange(
    newValues: number[],
    activeThumb: ActiveThumb,
    min: number,
    max: number,
    minGap: number,
  ): SliderRange {
    const validatedValues = this.validateRange(newValues, min, max);
    return this.applyMinGap(validatedValues, minGap, activeThumb, min, max);
  }
}
