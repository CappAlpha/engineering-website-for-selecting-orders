import { createSelector } from "@reduxjs/toolkit";

import { FiltersState } from "./filtersSlice";

interface RootState {
  filters: FiltersState;
}

const selectFilters = (state: RootState) => state.filters;

export const selectSelectedTags = createSelector(
  [selectFilters],
  (filters) => new Set(filters.selectedTags),
);

export const selectPrices = createSelector(
  [selectFilters],
  (filters) => filters.prices,
);
