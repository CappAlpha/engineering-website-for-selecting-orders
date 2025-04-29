import { createSlice } from "@reduxjs/toolkit";

interface Props {
  activeId: string | null;
}

const initialState: Props = {
  activeId: null,
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
