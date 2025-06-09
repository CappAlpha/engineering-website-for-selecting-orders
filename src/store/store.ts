import { configureStore } from "@reduxjs/toolkit";

import { cartApi } from "@/shared/api/client/cartQuery.ts";
import { productsApi } from "@/shared/api/client/productsQuery.ts";
import { productsTagsApi } from "@/shared/api/client/productsTagsQuery.ts";

import { categoriesReducers } from "../modules/Catalog/store/categoriesSlice.ts";
import { filtersReducers } from "../modules/Catalog/store/filtersSlice.ts";

export const makeStore = () =>
  configureStore({
    reducer: {
      categories: categoriesReducers,
      filters: filtersReducers,
      productsApi: productsApi.reducer,
      productsTagsApi: productsTagsApi.reducer,
      cartApi: cartApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }).concat(
        productsApi.middleware,
        productsTagsApi.middleware,
        cartApi.middleware,
      ),
    devTools: true,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
