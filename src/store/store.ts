import { configureStore } from "@reduxjs/toolkit";

import { productsApi } from "@/shared/api/client/productsQuery.ts";
import { productsTagsApi } from "@/shared/api/client/productsTagsQuery.ts";

import { cartReducers } from "../modules/Cart/store/cartSlice.ts";
import { categoriesReducers } from "../modules/Catalog/store/categoriesSlice.ts";
import { filtersReducers } from "../modules/Catalog/store/filtersSlice.ts";

export const makeStore = () =>
  configureStore({
    reducer: {
      categories: categoriesReducers,
      cart: cartReducers,
      filters: filtersReducers,
      productsApi: productsApi.reducer,
      productsTagsApi: productsTagsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }).concat(productsApi.middleware, productsTagsApi.middleware),
    devTools: true,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
