import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/store/store";

import { cartSelectors } from "./cartSlice";

const selectCartState = (state: RootState) => state.cart;

export const {
  selectAll: selectAllCartItems,
  selectTotal: selectCartItemsCount,
} = cartSelectors;

export const selectTotalAmount = (state: RootState) =>
  selectCartState(state).totalAmount;

export const selectCartLoading = (state: RootState) =>
  selectCartState(state).loading;

export const selectCartErrors = (state: RootState) =>
  selectCartState(state).error;

export const selectIsItemUpdating = (id: number) =>
  createSelector([selectCartLoading], (loading) => loading.update[id] || false);

export const selectIsItemAdding = (productId: string) =>
  createSelector(
    [selectCartLoading],
    (loading) => loading.add[productId] || false,
  );

export const selectIsItemRemoving = (id: number) =>
  createSelector([selectCartLoading], (loading) => loading.remove[id] || false);
