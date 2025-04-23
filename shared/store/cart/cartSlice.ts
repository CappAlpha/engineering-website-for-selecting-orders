import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CartStateItem } from "@/entities/cart";
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

export const updateItemsQuantity = createAsyncThunk(
  "cart/updateItemsQuantity",
  async ({
    id,
    quantity,
  }: {
    id: number;
    quantity: number;
  }): Promise<CartReturnProps> => {
    const data = await Api.cart.updateItemsQuantity(id, quantity);
    return getCartDetails(data);
  },
);

// export const addCartItem = createAsyncThunk(
//   'cart/addCartItem',
//   async (values: any) => {
//     const response = await fetch('/api/cart', {
//       method: 'POST',
//       body: JSON.stringify(values),
//     });
//     return await response.json();
//   }
// );

// export const removeCartItem = createAsyncThunk(
//   'cart/removeCartItem',
//   async (id: string) => {
//     await fetch(`/api/cart/${id}`, {
//       method: 'DELETE',
//     });
//     return id;
//   }
// );

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

      // updateItemsQuantity
      .addCase(updateItemsQuantity.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(
        updateItemsQuantity.fulfilled,
        (state, action: PayloadAction<CartReturnProps>) => {
          state.loading = false;
          state.items = action.payload.items;
          state.totalAmount = action.payload.totalAmount;
        },
      )
      .addCase(updateItemsQuantity.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });

    // // addCartItem
    // .addCase(addCartItem.pending, (state) => {
    //   state.loading = true;
    //   state.error = false;
    // })
    // .addCase(addCartItem.fulfilled, (state, action: PayloadAction<CartReturnProps>) => {
    //   state.loading = false;
    //   state.items.push(action.payload);
    //   // Recalculate totalAmount if needed
    // })
    // .addCase(addCartItem.rejected, (state) => {
    //   state.loading = false;
    //   state.error = true;
    // })

    // // removeCartItem
    // .addCase(removeCartItem.pending, (state) => {
    //   state.loading = true;
    //   state.error = false;
    // })
    // .addCase(removeCartItem.fulfilled, (state, action: PayloadAction<string>) => {
    //   state.loading = false;
    //   state.items = state.items.filter((item) => item.id !== action.payload);
    //   // Recalculate totalAmount if needed
    // })
    // .addCase(removeCartItem.rejected, (state) => {
    //   state.loading = false;
    //   state.error = true;
    // });
  },
});

export const cartActions = cartSlice.actions;
export const cartReducers = cartSlice.reducer;
