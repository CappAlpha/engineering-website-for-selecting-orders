import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { filtersActions } from "@/store/filters/filtersSlice";

export const useResetFilters = (router: AppRouterInstance) => {
  const dispatch = useDispatch();

  const resetFilters = useCallback(() => {
    dispatch(filtersActions.clearTags());
    dispatch(filtersActions.resetPrices());
    router.push("/", { scroll: false });
  }, [router, dispatch]);

  return { resetFilters };
};
