import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FiltersState {
  selectedTags: string[];
  prices: {
    priceFrom?: number;
    priceTo?: number;
  };
}

const initialState: FiltersState = {
  selectedTags: [],
  prices: {
    priceFrom: undefined,
    priceTo: undefined,
  },
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSelectedTags: (
      state,
      action: PayloadAction<FiltersState["selectedTags"]>,
    ) => {
      state.selectedTags = action.payload;
    },
    toggleTag: (state, action: PayloadAction<string>) => {
      const tag = action.payload;
      if (state.selectedTags.includes(tag)) {
        state.selectedTags = state.selectedTags.filter((t) => t !== tag);
      } else {
        state.selectedTags.push(tag);
      }
    },
    clearTags: (state) => {
      state.selectedTags = [];
    },
    setPrices: (state, action: PayloadAction<FiltersState["prices"]>) => {
      state.prices = action.payload;
    },
    resetPrices: (state) => {
      state.prices = { priceFrom: undefined, priceTo: undefined };
    },
  },
});

export const filtersActions = filtersSlice.actions;
export const filtersReducers = filtersSlice.reducer;
