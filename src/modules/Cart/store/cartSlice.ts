import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from "@reduxjs/toolkit";

import {
  CartStateItem,
  CreateCartItemValues,
} from "@/modules/Cart/entities/cart";
import { Api } from "@/shared/services/apiClient";
import { createErrorMessage } from "@/shared/utils/createErrorMessage";
import type { RootState } from "@/store/store";

import { CartReturnProps, getCartDetails } from "../services/getCartDetails";

const cartAdapter = createEntityAdapter<CartStateItem, number>({
  selectId: (item) => item.id,
});

interface CartLoadingState {
  fetch: boolean;
  update: Record<number, boolean>;
  add: Record<string, boolean>;
  remove: Record<number, boolean>;
  removeAll: boolean;
}

interface CartErrorState {
  fetch: string | null;
  update: string | null;
  add: string | null;
  remove: string | null;
  removeAll: string | null;
}

interface CartState {
  loading: CartLoadingState;
  error: CartErrorState;
  totalAmount: number;
}

const initialState = cartAdapter.getInitialState<CartState>({
  ...cartAdapter.getInitialState(),
  loading: {
    fetch: true,
    update: {},
    add: {},
    remove: {},
    removeAll: false,
  },
  error: {
    fetch: null,
    update: null,
    add: null,
    remove: null,
    removeAll: null,
  },
  totalAmount: 0,
});

export const fetchCartItems = createAsyncThunk(
  "cart/getCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Api.cart.getCart();
      return getCartDetails(response);
    } catch (err) {
      return rejectWithValue(
        createErrorMessage("fetchCartItems", err, "Failed to get cart items"),
      );
    }
  },
);

export const updateItemQuantity = createAsyncThunk(
  "cart/updateItemQuantity",
  async (
    {
      id,
      quantity,
    }: {
      id: number;
      quantity: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await Api.cart.updateItemQuantity(id, quantity);
      return getCartDetails(response);
    } catch (err) {
      return rejectWithValue(
        createErrorMessage(
          "updateItemQuantity",
          err,
          "Failed to update item quantity in cart",
        ),
      );
    }
  },
);

export const addCartItem = createAsyncThunk<
  CartReturnProps,
  { values: CreateCartItemValues }
>("cart/addCartItem", async ({ values }, { rejectWithValue }) => {
  try {
    const response = await Api.cart.addCartItem(values);
    return getCartDetails(response);
  } catch (err) {
    return rejectWithValue(
      createErrorMessage("addCartItem", err, "Failed to add item to cart"),
    );
  }
});

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async ({ id }: { id: number }, { rejectWithValue }) => {
    try {
      const response = await Api.cart.removeCartItem(id);
      return getCartDetails(response);
    } catch (err) {
      return rejectWithValue(
        createErrorMessage(
          "removeCartItem",
          err,
          "Failed to remove item from cart",
        ),
      );
    }
  },
);

export const removeCartItems = createAsyncThunk(
  "cart/removeCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Api.cart.removeCartItems();
      return getCartDetails(response);
    } catch (err) {
      return rejectWithValue(
        createErrorMessage(
          "removeCartItems",
          err,
          "Failed to remove all items from cart",
        ),
      );
    }
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
        removeAll: null,
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch items
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
        state.error.fetch = action.error?.message ?? "Failed to get cart items";
        state.loading.fetch = false;
      });

    // Update item quantity
    builder
      .addCase(updateItemQuantity.pending, (state, action) => {
        const { id } = action.meta.arg;
        state.loading.update[id] = true;
        state.error.update = null;
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        const { id } = action.meta.arg;
        cartAdapter.upsertMany(state, action.payload.items);
        state.totalAmount = action.payload.totalAmount;
        delete state.loading.update[id]; // Clean up loading state
      })
      .addCase(updateItemQuantity.rejected, (state, action) => {
        const { id } = action.meta.arg;
        state.error.update =
          action.error?.message ?? "Failed to update cart item";
        delete state.loading.update[id];
      });

    // Add item
    builder
      .addCase(addCartItem.pending, (state, action) => {
        const { productId } = action.meta.arg.values;
        state.loading.add[productId] = true;
        state.error.add = null;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        const { productId } = action.meta.arg.values;
        cartAdapter.upsertMany(state, action.payload.items);
        state.totalAmount = action.payload.totalAmount;
        delete state.loading.add[productId];
      })
      .addCase(addCartItem.rejected, (state, action) => {
        const { productId } = action.meta.arg.values;
        state.error.add = action.error?.message ?? "Failed to add cart item";
        delete state.loading.add[productId];
      });

    // Remove item
    builder
      .addCase(removeCartItem.pending, (state, action) => {
        const { id } = action.meta.arg;
        state.loading.remove[id] = true;
        state.error.remove = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        const { id } = action.meta.arg;
        cartAdapter.removeOne(state, id);
        state.totalAmount = action.payload.totalAmount;
        delete state.loading.remove[id];
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        const { id } = action.meta.arg;
        state.error.remove =
          action.error?.message ?? "Failed to remove cart item";
        delete state.loading.remove[id];
      });

    // Remove items
    builder
      .addCase(removeCartItems.pending, (state) => {
        state.loading.removeAll = true;
        state.error.removeAll = null;
      })
      .addCase(removeCartItems.fulfilled, (state, action) => {
        cartAdapter.removeAll(state);
        state.totalAmount = action.payload.totalAmount;
        state.loading.removeAll = false;
      })
      .addCase(removeCartItems.rejected, (state, action) => {
        state.error.removeAll =
          action.error?.message ?? "Failed to remove cart items";
        state.loading.removeAll = false;
      });
  },
});

export const cartReducers = cartSlice.reducer;
export const cartSelectors = cartAdapter.getSelectors<RootState>(
  (state) => state.cart,
);
