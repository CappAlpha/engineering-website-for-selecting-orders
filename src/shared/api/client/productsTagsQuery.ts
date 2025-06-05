import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { PageConfig } from "../../constants/pages";

export const productsTagsApi = createApi({
  reducerPath: "productsTagsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["ProductsTags"],
  endpoints: (builder) => ({
    getProductsTags: builder.query<string[], void>({
      query: () => PageConfig.TAGS.replace("/api/", ""),
      providesTags: ["ProductsTags"],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useGetProductsTagsQuery } = productsTagsApi;
