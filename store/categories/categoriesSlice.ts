import { createSlice } from "@reduxjs/toolkit";

export interface Props {
  activeId: number;
}

const initialState: Props = {
  activeId: 1,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setActiveId: (state, action) => {
      state.activeId = action.payload;
    },
  },
});

export const categoriesActions = categoriesSlice.actions;
export const categoriesReducers = categoriesSlice.reducer;
