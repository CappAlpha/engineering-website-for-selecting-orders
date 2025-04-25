import { createSlice } from "@reduxjs/toolkit";

export interface Props {
  isReset: boolean;
}

const initialState: Props = {
  isReset: false,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setIsReset: (state, action) => {
      state.isReset = action.payload;
    },
  },
});

export const filtersActions = filtersSlice.actions;
export const filtersReducers = filtersSlice.reducer;
