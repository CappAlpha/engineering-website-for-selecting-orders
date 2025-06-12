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
      async onQueryStarted({ id, quantity }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            const item = draft.items.find((item) => item.id === id);

            if (item) {
              const unitPrice = item.price / item.quantity;

              let newTotal = 0;
              for (const cartItem of draft.items) {
                newTotal += cartItem.price;
              }

              item.price = unitPrice * quantity;
              item.quantity = quantity;
              draft.totalAmount = newTotal;
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            draft.items = [];
            draft.totalAmount = 0;
            draft.items.length = 0;
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
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
