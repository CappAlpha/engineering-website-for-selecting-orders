import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useDispatch } from "react-redux";

import { filtersActions } from "@/modules/Catalog/store/filtersSlice";

/**
 * Hook to reset filters state and clear local storage.
 *
 * @param router - Instance of Next.js AppRouter.
 * @returns Object with a single method `resetFilters` that resets filters state and clears local storage.
 */
export const useResetFilters = (router: AppRouterInstance) => {
  const dispatch = useDispatch();

  const resetFilters = () => {
    dispatch(filtersActions.clearTags());
    dispatch(filtersActions.resetPrices());
    localStorage.removeItem("tagsData");
    router.push("/", { scroll: false });
  };

  return { resetFilters };
};
