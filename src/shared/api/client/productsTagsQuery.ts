import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { PageConfig } from "../../constants/pages";

export const productsTagsApi = createApi({
  reducerPath: "productsTagsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
  }),
  tagTypes: ["ProductsTags"],
  endpoints: (builder) => ({
    getProductsTags: builder.query<string[], void>({
      query: () => PageConfig.TAGS,
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useGetProductsTagsQuery } = productsTagsApi;
