import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { createCartErrorMessage } from "@/modules/Cart/utils/createCartErrorMessage";
import { Api } from "@/shared/services/apiClient";

export interface PriceRange {
  minPrice: number;
  maxPrice: number;
}

interface FiltersState {
  selectedTags: string[];
  priceRange: PriceRange;
  prices: {
    priceFrom?: number;
    priceTo?: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: FiltersState = {
  selectedTags: [],
  priceRange: {
    minPrice: 0,
    maxPrice: 100000,
  },
  prices: {
    priceFrom: undefined,
    priceTo: undefined,
  },
  loading: true,
  error: null,
};

// TODO:Переделать и сделать как с тегами?
export const fetchPriceRange = createAsyncThunk(
  "filters/fetchPriceRange",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Api.products.getPriceRange();
      return response;
    } catch (err) {
      return rejectWithValue(
        createCartErrorMessage(
          "fetchPriceRange",
          err,
          "Failed to get price range",
        ),
      );
    }
  },
);

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
      state.prices = {
        priceFrom: undefined,
        priceTo: undefined,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPriceRange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPriceRange.fulfilled, (state, action) => {
        state.loading = false;
        state.priceRange = {
          minPrice: action.payload.minPrice,
          maxPrice: action.payload.maxPrice,
        };
        state.error = null;
      })
      .addCase(fetchPriceRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const filtersActions = filtersSlice.actions;
export const filtersReducers = filtersSlice.reducer;
