import { AppDispatch } from "@/store/store";

import { filtersActions } from "../store/filtersSlice";

export const resetChanged = (
  dispatch: AppDispatch,
  delay: number = 1000,
): (() => void) => {
  const timeout = setTimeout(() => {
    try {
      dispatch(filtersActions.resetChanged());
    } catch (error) {
      console.error("Failed to dispatch resetChanged:", error);
    }
  }, delay);

  return () => clearTimeout(timeout);
};
