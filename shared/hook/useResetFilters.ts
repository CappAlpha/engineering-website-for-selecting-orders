import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { useActions } from "./useActions";
import { useAppSelector } from "./useAppSelector";

export const useResetFilters = (): {
  isReset: boolean;
  setIsReset: (value: boolean) => void;
  onClickResetFilters: (router: AppRouterInstance) => () => void;
} => {
  const isReset = useAppSelector((state) => state.filters.isReset);
  const { setIsReset } = useActions();

  const onClickResetFilters = (router: AppRouterInstance) => () => {
    setIsReset(true);
    router.push("/", { scroll: false });
    // TODO: remove this
    setTimeout(() => setIsReset(false), 0.1);
  };

  return { isReset, setIsReset, onClickResetFilters };
};
