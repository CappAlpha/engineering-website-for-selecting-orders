import { configureStore } from "@reduxjs/toolkit";

import { cartReducers } from "./cart/cartSlice.ts";
import { categoriesReducers } from "./categories/categoriesSlice.ts";
import { filtersReducers } from "./filters/filtersSlice.ts";

export const makeStore = () =>
  configureStore({
    reducer: {
      categories: categoriesReducers,
      cart: cartReducers,
      filters: filtersReducers,
    },
    devTools: true,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
