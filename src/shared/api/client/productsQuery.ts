import { Product } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { PageConfig } from "../../constants/pages";

export interface PriceRange {
  minPrice: number;
  maxPrice: number;
}

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["PriceRange", "SearchProducts"],
  endpoints: (builder) => ({
    getPriceRange: builder.query<PriceRange, void>({
      query: () => PageConfig.PRICE_RANGE.replace("/api/", ""),
      providesTags: ["PriceRange"],
      keepUnusedDataFor: 300,
    }),

    searchProducts: builder.query<Product[], string>({
      query: (searchQuery) => ({
        url: PageConfig.SEARCH_PRODUCTS.replace("/api/", ""),
        params: { q: searchQuery },
      }),
      providesTags: (result, error, searchQuery) => [
        { type: "SearchProducts", id: searchQuery },
      ],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
  useGetPriceRangeQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
} = productsApi;
