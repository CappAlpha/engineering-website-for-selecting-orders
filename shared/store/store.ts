import { configureStore } from "@reduxjs/toolkit";

import { categoriesReducers } from "./categories/categoriesSlice.ts";

export const makeStore = () =>
  configureStore({
    reducer: {
      categories: categoriesReducers,
    },
    devTools: true,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
