import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import { cartActions } from "../store/cart/cartSlice.ts";
import { categoriesActions } from "../store/categories/categoriesSlice.ts";
import { filtersActions } from "../store/filters/filtersSlice.ts";

const actions = {
  ...categoriesActions,
  ...cartActions,
  ...filtersActions,
};

export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actions, dispatch);
};
