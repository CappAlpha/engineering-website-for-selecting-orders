import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  selectedTags: string[];
  prices: {
    priceFrom?: number;
    priceTo?: number;
  };
  changed: boolean;
}

const initialState: FiltersState = {
  selectedTags: [],
  prices: {
    priceFrom: undefined,
    priceTo: undefined,
  },
  changed: true,
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
      state.changed = true;
    },
    toggleTag: (state, action: PayloadAction<string>) => {
      const tag = action.payload;
      if (state.selectedTags.includes(tag)) {
        state.selectedTags = state.selectedTags.filter((t) => t !== tag);
      } else {
        state.selectedTags.push(tag);
      }
      state.changed = true;
    },
    clearTags: (state) => {
      state.selectedTags = [];
      state.changed = true;
    },
    setPrices: (state, action: PayloadAction<FiltersState["prices"]>) => {
      state.prices = action.payload;
      state.changed = true;
    },
    resetPrices: (state) => {
      state.prices = {
        priceFrom: undefined,
        priceTo: undefined,
      };
      state.changed = true;
    },
    resetChanged: (state) => {
      state.changed = false;
    },
  },
});

export const filtersActions = filtersSlice.actions;
export const filtersReducers = filtersSlice.reducer;
