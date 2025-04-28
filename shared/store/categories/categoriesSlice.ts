import { createSlice } from "@reduxjs/toolkit";

export interface Props {
  activeId: string;
}

const initialState: Props = {
  activeId: "",
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
