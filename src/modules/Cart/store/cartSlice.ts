import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from "@reduxjs/toolkit";

import { CartStateItem, CreateCartItemValues } from "@/entities/cart";
import { Api } from "@/shared/services/apiClient";
import type { RootState } from "@/store/store";

import { CartReturnProps, getCartDetails } from "../actions/getCartDetails";

const cartAdapter = createEntityAdapter<CartStateItem, number>({
  selectId: (item) => item.id,
});

interface CartLoadingState {
  fetch: boolean;
  update: Record<number, boolean>;
  add: Record<string, boolean>;
  remove: Record<number, boolean>;
}

interface CartErrorState {
  fetch: string | null;
  update: string | null;
  add: string | null;
  remove: string | null;
}

interface CartState {
  loading: CartLoadingState;
  error: CartErrorState;
  totalAmount: number;
}

const initialState = cartAdapter.getInitialState<CartState>({
  loading: {
    fetch: true,
    update: {},
    add: {},
    remove: {},
  },
  error: {
    fetch: null,
    update: null,
    add: null,
    remove: null,
  },
  totalAmount: 0,
});

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
      state.error = {
        fetch: null,
        update: null,
        add: null,
        remove: null,
      };
    },
  },
  extraReducers: (builder) => {
    // fetchCartItems
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        cartAdapter.setAll(state, action.payload.items);
        state.totalAmount = action.payload.totalAmount;
        state.loading.fetch = false;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.error.fetch = action.error?.message ?? "Ошибка получения товаров";
        state.loading.fetch = false;
      });

    // updateItemQuantity
    builder
      .addCase(updateItemQuantity.pending, (state, action) => {
        state.loading.update[action.meta.arg.id] = true;
        state.error.update = null;
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        cartAdapter.upsertMany(state, action.payload.items);
        state.totalAmount = action.payload.totalAmount;
        state.loading.update[action.meta.arg.id] = false;
      })
      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.error.update =
          action.error?.message ?? "Ошибка обновления товаров";
        state.loading.update[action.meta.arg.id] = false;
      });

    // addCartItem
    builder
      .addCase(addCartItem.pending, (state, action) => {
        state.loading.add[action.meta.arg.values.productId] = true;
        state.error.add = null;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        cartAdapter.upsertMany(state, action.payload.items);
        state.totalAmount = action.payload.totalAmount;
        state.loading.add[action.meta.arg.values.productId] = false;
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.error.add = action.error?.message ?? "Ошибка добавления товаров";
        state.loading.add[action.meta.arg.values.productId] = false;
      });

    // removeCartItem
    builder
      .addCase(removeCartItem.pending, (state, action) => {
        state.loading.remove[action.meta.arg.id] = true;
        state.error.remove = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        cartAdapter.removeOne(state, action.meta.arg.id);
        state.totalAmount = action.payload.totalAmount;
        state.loading.remove[action.meta.arg.id] = false;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.error.remove = action.error?.message ?? "Ошибка удаления товаров";
        state.loading.remove[action.meta.arg.id] = false;
      });
  },
});

export const cartActions = cartSlice.actions;
export const cartReducers = cartSlice.reducer;
export const cartSelectors = cartAdapter.getSelectors<RootState>(
  (state) => state.cart,
);
