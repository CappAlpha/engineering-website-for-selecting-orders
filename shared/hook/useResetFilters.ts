import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { useActions } from "./useActions";
import { useAppSelector } from "./useAppSelector";

export const useResetFilters = () => {
  const { setIsReset } = useActions();
  const isReset = useAppSelector((state) => state.filters.isReset);

  const onClickResetFilters = (router: AppRouterInstance) => () => {
    setIsReset(true);
    router.push("/", { scroll: false });
  };

  return { isReset, setIsReset, onClickResetFilters };
};
