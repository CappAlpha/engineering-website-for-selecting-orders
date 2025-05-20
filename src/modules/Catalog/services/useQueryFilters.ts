import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import qs from "qs";
import { useEffect } from "react";

import { useDebouncedCallback } from "@/shared/hook/useDebounce";

/**
 * useQueryFilters updates the URL with the current filters when they change.
 * It should be used in the Catalog page.
 *
 * @param router The AppRouter instance from Next.js
 * @param priceFrom The minimum price selected
 * @param priceTo The maximum price selected
 * @param tags The tags selected
 *
 * @returns A function that can be used to update the URL with the current filters.
 * The function is debounced to prevent excessive updates.
 */
export const useQueryFilters = (
  router: AppRouterInstance,
  priceFrom: number | undefined,
  priceTo: number | undefined,
  tags: string[],
) => {
  const updateUrl = useDebouncedCallback(
    (filters: { priceFrom?: number; priceTo?: number; tags: string[] }) => {
      const query = qs.stringify(filters, {
        arrayFormat: "comma",
        skipNulls: true,
      });
      router.push(`?${query}`, { scroll: false });
    },
    300,
  );

  // Update URL when filter changes
  useEffect(() => {
    updateUrl({ priceFrom, priceTo, tags });
  }, [priceFrom, priceTo, tags]);
};
