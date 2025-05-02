import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useDispatch } from "react-redux";

import { filtersActions } from "@/modules/Catalog/store/filtersSlice";

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
