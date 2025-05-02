import { configureStore } from "@reduxjs/toolkit";

import { cartReducers } from "../modules/Cart/store/cartSlice.ts";
import { categoriesReducers } from "../modules/Catalog/store/categoriesSlice.ts";
import { filtersReducers } from "../modules/Catalog/store/filtersSlice.ts";

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
