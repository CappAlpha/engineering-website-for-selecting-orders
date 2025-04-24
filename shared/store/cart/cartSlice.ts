import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CartStateItem, CreateCartItemValues } from "@/entities/cart";
import { Api } from "@/services/api-client";
import { CartReturnProps, getCartDetails } from "@/utils/getCartDetails";

export interface CartState {
  loading: boolean;
  error: boolean;
  totalAmount: number;
  items: CartStateItem[];
}

const initialState: CartState = {
  loading: true,
  error: false,
  totalAmount: 0,
  items: [],
};

export const fetchCartItems = createAsyncThunk(
  "cart/getCartItems",
  async (): Promise<CartReturnProps> => {
    const data = await Api.cart.getCart();
    return getCartDetails(data);
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
    const data = await Api.cart.updateItemQuantity(id, quantity);
    return getCartDetails(data);
  },
);

export const addCartItem = createAsyncThunk(
  "cart/addCartItem",
  async ({
    values,
  }: {
    values: CreateCartItemValues;
  }): Promise<CartReturnProps> => {
    const data = await Api.cart.addCartItem(values);
    return getCartDetails(data);
  },
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async ({ id }: { id: number }): Promise<CartReturnProps> => {
    const data = await Api.cart.removeCartItem(id);
    return getCartDetails(data);
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = false;
    },
  },
  extraReducers: (builder) => {
    // getCartItems
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = false;
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
        state.error = true;
      })

      // updateItemQuantity
      .addCase(updateItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = false;
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
        state.error = true;
      })

      // addCartItem
      .addCase(addCartItem.pending, (state) => {
        state.loading = true;
        state.error = false;
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
        state.error = true;
      })

      // removeCartItem
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = false;
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
        state.error = true;
      });
  },
});

export const cartActions = cartSlice.actions;
export const cartReducers = cartSlice.reducer;
