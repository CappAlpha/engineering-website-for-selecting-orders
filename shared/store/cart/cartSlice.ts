import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CartStateItem, CreateCartItemValues } from "@/entities/cart";
import { Api } from "@/services/apiClient";
import { CartReturnProps, getCartDetails } from "@/utils/getCartDetails";

export interface CartState {
  loadingFetch: boolean;
  loadingUpdate: boolean;
  loadingAdd: boolean;
  loadingRemove: boolean;

  errorFetch: string | null;
  errorUpdate: string | null;
  errorAdd: string | null;
  errorRemove: string | null;

  totalAmount: number;
  items: CartStateItem[];
}

const initialState: CartState = {
  loadingFetch: true,
  loadingUpdate: false,
  loadingAdd: false,
  loadingRemove: false,

  errorFetch: null,
  errorUpdate: null,
  errorAdd: null,
  errorRemove: null,

  totalAmount: 0,
  items: [],
};

export const fetchCartItems = createAsyncThunk(
  "cart/getCartItems",
  async (): Promise<CartReturnProps> => {
    const response = await Api.cart.getCart();
    return getCartDetails(response);
  },
);

export const updateItemQuantity = createAsyncThunk(
  "cart/updateItemQuantity",
  async ({
    id,
    quantity,
  }: {
    id: number;
    quantity: number;
  }): Promise<CartReturnProps> => {
    const response = await Api.cart.updateItemQuantity(id, quantity);
    return getCartDetails(response);
  },
);

export const addCartItem = createAsyncThunk<
  CartReturnProps,
  { values: CreateCartItemValues }
>("cart/addCartItem", async ({ values }) => {
  const response = await Api.cart.addCartItem(values);
  return getCartDetails(response);
});

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async ({ id }: { id: number }): Promise<CartReturnProps> => {
    const response = await Api.cart.removeCartItem(id);
    return getCartDetails(response);
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetError: (state) => {
      state.errorFetch = null;
      state.errorUpdate = null;
      state.errorAdd = null;
      state.errorRemove = null;
    },
  },
  extraReducers: (builder) => {
    // fetchCartItems
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.errorFetch = null;
      })
      .addCase(
        fetchCartItems.fulfilled,
        (state, action: PayloadAction<CartReturnProps>) => {
          state.loadingFetch = false;
          state.items = action.payload.items;
          state.totalAmount = action.payload.totalAmount;
        },
      )
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loadingFetch = false;
        state.errorFetch = action.error?.message ?? "Ошибка получения товаров";
      });

    // updateItemQuantity
    builder
      .addCase(updateItemQuantity.pending, (state) => {
        state.loadingUpdate = true;
        state.errorUpdate = null;
      })
      .addCase(
        updateItemQuantity.fulfilled,
        (state, action: PayloadAction<CartReturnProps>) => {
          state.loadingUpdate = false;
          state.items = action.payload.items;
          state.totalAmount = action.payload.totalAmount;
        },
      )
      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.errorUpdate =
          action.error?.message ?? "Ошибка обновления товаров";
      });

    // addCartItem
    builder
      .addCase(addCartItem.pending, (state) => {
        state.loadingAdd = true;
        state.errorAdd = null;
      })
      .addCase(
        addCartItem.fulfilled,
        (state, action: PayloadAction<CartReturnProps>) => {
          state.loadingAdd = false;
          state.items = action.payload.items;
          state.totalAmount = action.payload.totalAmount;
        },
      )
      .addCase(addCartItem.rejected, (state, action) => {
        state.loadingAdd = false;
        state.errorAdd = action.error?.message ?? "Ошибка добавления товаров";
      });

    // removeCartItem
    builder
      .addCase(removeCartItem.pending, (state) => {
        state.loadingRemove = true;
        state.errorRemove = null;
      })
      .addCase(
        removeCartItem.fulfilled,
        (state, action: PayloadAction<CartReturnProps>) => {
          state.loadingRemove = false;
          state.items = action.payload.items;
          state.totalAmount = action.payload.totalAmount;
        },
      )
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loadingRemove = false;
        state.errorRemove = action.error?.message ?? "Ошибка удаления товаров";
      });
  },
});

export const cartActions = cartSlice.actions;
export const cartReducers = cartSlice.reducer;
