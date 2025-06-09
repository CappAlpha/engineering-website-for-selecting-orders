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
    baseUrl: "/api",
  }),
  tagTypes: ["PriceRange", "SearchProducts"],
  endpoints: (builder) => ({
    getPriceRange: builder.query<PriceRange, void>({
      query: () => PageConfig.PRICE_RANGE,
      providesTags: ["PriceRange"],
      keepUnusedDataFor: 300,
    }),

    searchProducts: builder.query<Product[], string>({
      query: (searchQuery) => ({
        url: PageConfig.SEARCH_PRODUCTS,
        params: { q: searchQuery },
      }),
      providesTags: (result, error, searchQuery) => [
        { type: "SearchProducts", id: searchQuery },
      ],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useGetPriceRangeQuery, useLazySearchProductsQuery } =
  productsApi;
