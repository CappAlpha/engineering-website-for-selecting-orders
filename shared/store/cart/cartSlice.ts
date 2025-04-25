import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CartStateItem, CreateCartItemValues } from "@/entities/cart";
import { Api } from "@/services/apiClient";
import { CartReturnProps, getCartDetails } from "@/utils/getCartDetails";

export interface CartState {
  loading: boolean;
  error: string | null;
  totalAmount: number;
  items: CartStateItem[];
}

const initialState: CartState = {
  loading: true,
  error: null,
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
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // getCartItems
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCartItems.fulfilled,
        (state, action: PayloadAction<CartReturnProps>) => {
          state.loading = false;
          state.items = action.payload.items;
          state.totalAmount = action.payload.totalAmount;
        },
      )
      .addCase(fetchCartItems.rejected, (state) => {
        state.loading = false;
        state.error = "Ошибка получения товаров";
      })

      // updateItemQuantity
      .addCase(updateItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateItemQuantity.fulfilled,
        (state, action: PayloadAction<CartReturnProps>) => {
          state.loading = false;
          state.items = action.payload.items;
          state.totalAmount = action.payload.totalAmount;
        },
      )
      .addCase(updateItemQuantity.rejected, (state) => {
        state.loading = false;
        state.error = "Ошибка обновления товаров";
      })

      // addCartItem
      .addCase(addCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addCartItem.fulfilled,
        (state, action: PayloadAction<CartReturnProps>) => {
          state.loading = false;
          state.items = action.payload.items;
          state.totalAmount = action.payload.totalAmount;
        },
      )
      .addCase(addCartItem.rejected, (state) => {
        state.loading = false;
        state.error = "Ошибка добавления товаров";
      })

      // removeCartItem
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeCartItem.fulfilled,
        (state, action: PayloadAction<CartReturnProps>) => {
          state.loading = false;
          state.items = action.payload.items;
          state.totalAmount = action.payload.totalAmount;
        },
      )
      .addCase(removeCartItem.rejected, (state) => {
        state.loading = false;
        state.error = state.error = "Ошибка удаления товаров";
      });
  },
});

export const cartActions = cartSlice.actions;
export const cartReducers = cartSlice.reducer;
