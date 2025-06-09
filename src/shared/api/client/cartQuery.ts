import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { CartDTO, CreateCartItemValues } from "@/modules/Cart/entities/cart";
import {
  CartReturnProps,
  getCartDetails,
} from "@/modules/Cart/services/getCartDetails";
import { createCartErrorMessage } from "@/modules/Cart/utils/createCartErrorMessage";
import { PageConfig } from "@/shared/constants/pages";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCart: builder.query<CartReturnProps, void>({
      query: () => PageConfig.CART,
      transformResponse: (response: CartDTO) => getCartDetails(response),
      transformErrorResponse: (response) =>
        createCartErrorMessage(
          "getCart",
          response,
          "Ошибка получения товаров корзины",
        ),
      providesTags: ["Cart"],
    }),

    updateItemQuantity: builder.mutation<
      CartReturnProps,
      { id: number; quantity: number }
    >({
      query: ({ id, quantity }) => ({
        url: `${PageConfig.CART}/${id}`,
        method: "PATCH",
        body: { quantity },
      }),
      transformResponse: (response: CartDTO) => getCartDetails(response),
      transformErrorResponse: (response) =>
        createCartErrorMessage(
          "updateItemQuantity",
          response,
          "Ошибка обновления количества товара в корзине",
        ),
      invalidatesTags: ["Cart"],
    }),

    addCartItem: builder.mutation<CartReturnProps, CreateCartItemValues>({
      query: (values) => ({
        url: `${PageConfig.CART}`,
        method: "POST",
        body: values,
      }),
      transformResponse: (response: CartDTO) => getCartDetails(response),
      transformErrorResponse: (response) =>
        createCartErrorMessage(
          "addCartItem",
          response,
          "Ошибка добавления товара в корзину",
        ),
      invalidatesTags: ["Cart"],
    }),

    removeCartItem: builder.mutation<CartReturnProps, { id: number }>({
      query: ({ id }) => ({
        url: `${PageConfig.CART}/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: CartDTO) => getCartDetails(response),
      transformErrorResponse: (response) =>
        createCartErrorMessage(
          "removeCartItem",
          response,
          "Ошибка удаления товара из корзины",
        ),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation<CartReturnProps, void>({
      query: () => ({
        url: `${PageConfig.CART}`,
        method: "DELETE",
      }),
      transformResponse: (response: CartDTO) => getCartDetails(response),
      transformErrorResponse: (response) =>
        createCartErrorMessage("clearCart", response, "Ошибка очистки корзины"),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useUpdateItemQuantityMutation,
  useAddCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi;
