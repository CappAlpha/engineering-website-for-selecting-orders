import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { PageConfig } from "../../constants/pages";

export const tagsApi = createApi({
  reducerPath: "tagsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Tags"],
  endpoints: (builder) => ({
    getTags: builder.query<string[], void>({
      query: () => PageConfig.TAGS.replace("/api/", ""),
      providesTags: ["Tags"],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useGetTagsQuery } = tagsApi;
