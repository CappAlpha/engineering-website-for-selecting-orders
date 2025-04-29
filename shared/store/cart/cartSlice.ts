import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CartStateItem, CreateCartItemValues } from "@/entities/cart";
import { Api } from "@/services/apiClient";
import { CartReturnProps, getCartDetails } from "@/utils/getCartDetails";

export interface CartState {
  loadingFetch: boolean;
  loadingUpdate: boolean;
  loadingAdd: boolean;
  loadingRemove: boolean;

  loadingUpdateProductId: number | null;
  loadingAddProductId: string | null;

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

  loadingUpdateProductId: null,
  loadingAddProductId: null,

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
          state.items = action.payload.items;
          state.totalAmount = action.payload.totalAmount;
          state.loadingFetch = false;
        },
      )
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.errorFetch = action.error?.message ?? "Ошибка получения товаров";
        state.loadingFetch = false;
      });

    // updateItemQuantity
    builder
      .addCase(updateItemQuantity.pending, (state, action) => {
        state.loadingUpdateProductId = action.meta.arg.id;
        state.loadingUpdate = true;
        state.errorUpdate = null;
      })
      .addCase(
        updateItemQuantity.fulfilled,
        (state, action: PayloadAction<CartReturnProps>) => {
          state.items = action.payload.items;
          state.totalAmount = action.payload.totalAmount;
          state.loadingUpdate = false;
          state.loadingUpdateProductId = null;
        },
      )
      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.errorUpdate =
          action.error?.message ?? "Ошибка обновления товаров";
        state.loadingUpdate = false;
        state.loadingUpdateProductId = null;
      });

    // addCartItem
    builder
      .addCase(addCartItem.pending, (state, action) => {
        state.loadingAddProductId = action.meta.arg.values.productId;
        state.loadingAdd = true;
        state.errorAdd = null;
      })
      .addCase(
        addCartItem.fulfilled,
        (state, action: PayloadAction<CartReturnProps>) => {
          state.items = action.payload.items;
          state.totalAmount = action.payload.totalAmount;
          state.loadingAdd = false;
          state.loadingAddProductId = null;
        },
      )
      .addCase(addCartItem.rejected, (state, action) => {
        state.errorAdd = action.error?.message ?? "Ошибка добавления товаров";
        state.loadingAdd = false;
        state.loadingAddProductId = null;
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
          state.items = action.payload.items;
          state.totalAmount = action.payload.totalAmount;
          state.loadingRemove = false;
        },
      )
      .addCase(removeCartItem.rejected, (state, action) => {
        state.errorRemove = action.error?.message ?? "Ошибка удаления товаров";
        state.loadingRemove = false;
      });
  },
});

export const cartActions = cartSlice.actions;
export const cartReducers = cartSlice.reducer;
