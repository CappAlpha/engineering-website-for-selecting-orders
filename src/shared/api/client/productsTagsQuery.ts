import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { PageConfig } from "../../constants/pages";

export const productsTagsApi = createApi({
  reducerPath: "productsTagsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["ProductsTags", "ProductTag"] as const,
  endpoints: (builder) => ({
    getProductsTags: builder.query<string[], void>({
      query: () => PageConfig.TAGS,
      providesTags: (result) =>
        result
          ? [
              ...result.map((name) => ({ type: "ProductTag" as const, name })),
              { type: "ProductsTags", id: "LIST" },
            ]
          : [{ type: "ProductsTags", id: "LIST" }],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useGetProductsTagsQuery } = productsTagsApi;
