import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { filtersActions } from "@/modules/Catalog/store/filtersSlice";

import { resetChanged } from "../services/resetChanged";

/**
 * Hook to reset filters state and clear local storage.
 *
 * @param router - Instance of Next.js AppRouter.
 * @returns Object with a single method `resetFilters` that resets filters state and clears local storage.
 */
export const useResetFilters = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const resetFilters = () => {
    dispatch(filtersActions.clearTags());
    dispatch(filtersActions.resetPrices());
    resetChanged(dispatch);
    router.push("/", { scroll: false });
  };

  return { resetFilters };
};
